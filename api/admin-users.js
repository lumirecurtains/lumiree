// Vercel Serverless Function: /api/admin-users
// Privileged admin-account management using the Firebase Admin SDK.
// Deployed automatically by Vercel alongside the frontend.
//
// Required Vercel environment variables (Server-side, NOT prefixed with VITE_):
//   FIREBASE_SERVICE_ACCOUNT  -> full service-account JSON (single line)
//   -- OR the three split values --
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY      (with literal \n sequences allowed)
//
// Actions (POST, JSON body, Authorization: Bearer <Firebase ID token>):
//   { action: 'create-admin', email, displayName? }
//   { action: 'set-role',     uid, role: 'admin' | 'customer' }
//   { action: 'set-status',   uid, status: 'active' | 'inactive' }

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { randomBytes } from 'node:crypto';

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL || 'lexcorp0777@gmail.com')
  .trim()
  .toLowerCase();

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateTemporaryPassword() {
  // 24 random bytes -> base64url, plus classes to satisfy any password policy.
  return `${randomBytes(24).toString('base64url')}Aa1!`;
}

function initAdmin() {
  if (getApps().length > 0) return;

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (rawJson) {
    initializeApp({ credential: cert(JSON.parse(rawJson)) });
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT ' +
      '(or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY) in Vercel.'
    );
  }

  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

async function requireSuperAdmin(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    const err = new Error('Missing Authorization bearer token.');
    err.status = 401;
    throw err;
  }

  const decoded = await getAuth().verifyIdToken(match[1]);
  const callerEmail = normalizeEmail(decoded.email);

  if (callerEmail === SUPER_ADMIN_EMAIL) {
    return decoded;
  }

  // Fallback: allow a Firestore-designated super_admin profile.
  const callerDoc = await getFirestore().collection('users').doc(decoded.uid).get();
  if (callerDoc.exists && callerDoc.data().role === 'super_admin') {
    return decoded;
  }

  const err = new Error('Only the Super Admin can manage admin accounts.');
  err.status = 403;
  throw err;
}

async function writeProfile(uid, { email, displayName, role, status, isNewDoc }) {
  const db = getFirestore();
  const userRef = db.collection('users').doc(uid);
  const emailRef = db.collection('emailIndex').doc(email);

  const base = {
    uid,
    email,
    displayName,
    role,
    status,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const batch = db.batch();
  batch.set(
    userRef,
    isNewDoc
      ? {
          ...base,
          wishlist: [],
          recentlyViewed: [],
          createdAt: FieldValue.serverTimestamp(),
        }
      : base,
    { merge: true }
  );
  batch.set(
    emailRef,
    { uid, email, displayName, role, status, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  await batch.commit();
}

async function handleCreateAdmin(body) {
  const email = normalizeEmail(body.email);
  const requestedName = (body.displayName || '').trim();

  if (!email || email.length > 254 || !isValidEmail(email)) {
    return { status: 400, payload: { error: 'Please enter a valid email address.' } };
  }
  if (requestedName.length > 120) {
    return { status: 400, payload: { error: 'Display name must be 120 characters or fewer.' } };
  }
  if (email === SUPER_ADMIN_EMAIL) {
    return { status: 409, payload: { error: 'That email is the permanent Super Admin account.' } };
  }

  const auth = getAuth();
  const db = getFirestore();

  let userRecord = null;
  try {
    userRecord = await auth.getUserByEmail(email);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }

  let alreadyExisted = Boolean(userRecord);

  if (!userRecord) {
    try {
      userRecord = await auth.createUser({
        email,
        password: generateTemporaryPassword(),
        displayName: requestedName || email.split('@')[0],
        emailVerified: false,
      });
    } catch (error) {
      // Race safety: if a concurrent request (or sign-up) created the account
      // between our lookup and createUser, recover instead of failing.
      if (error.code === 'auth/email-already-exists') {
        userRecord = await auth.getUserByEmail(email);
        alreadyExisted = true;
      } else {
        throw error;
      }
    }
  }

  const existingDoc = await db.collection('users').doc(userRecord.uid).get();
  if (existingDoc.exists && existingDoc.data().role === 'super_admin') {
    return {
      status: 409,
      payload: { error: 'That account is already the Super Admin and cannot be modified.' },
    };
  }

  const displayName =
    requestedName ||
    (existingDoc.exists && existingDoc.data().displayName) ||
    userRecord.displayName ||
    email.split('@')[0];

  await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
  await writeProfile(userRecord.uid, {
    email,
    displayName,
    role: 'admin',
    status: 'active',
    isNewDoc: !existingDoc.exists,
  });

  // Generate a password-setup link the Super Admin can share with the new admin.
  let resetLink = null;
  try {
    resetLink = await auth.generatePasswordResetLink(email);
  } catch (error) {
    console.error('generatePasswordResetLink failed:', error);
  }

  return {
    status: 200,
    payload: {
      success: true,
      uid: userRecord.uid,
      alreadyExisted,
      resetLink,
      message: alreadyExisted
        ? `${email} already had an account. It has been granted Admin access and its Firestore profile was synchronized.`
        : `${email} was created and granted Admin access. Share the password setup link with them.`,
    },
  };
}

async function handleSetRole(body) {
  const uid = (body.uid || '').trim();
  const role = body.role;

  if (!uid) return { status: 400, payload: { error: 'A target user id is required.' } };
  if (role !== 'admin' && role !== 'customer') {
    return { status: 400, payload: { error: 'Role must be admin or customer.' } };
  }

  const auth = getAuth();
  const userRecord = await auth.getUser(uid);
  const email = normalizeEmail(userRecord.email);

  if (email === SUPER_ADMIN_EMAIL) {
    return { status: 409, payload: { error: 'The permanent Super Admin account cannot be changed.' } };
  }

  const doc = await getFirestore().collection('users').doc(uid).get();
  const displayName =
    (doc.exists && doc.data().displayName) || userRecord.displayName || email.split('@')[0];
  const status = (doc.exists && doc.data().status) || 'active';

  await auth.setCustomUserClaims(uid, { role: role === 'admin' && status === 'active' ? 'admin' : 'customer' });
  await writeProfile(uid, { email, displayName, role, status, isNewDoc: !doc.exists });

  return {
    status: 200,
    payload: { success: true, message: role === 'admin' ? 'Admin access granted.' : 'Admin access removed.' },
  };
}

async function handleSetStatus(body) {
  const uid = (body.uid || '').trim();
  const status = body.status === 'inactive' ? 'inactive' : 'active';

  if (!uid) return { status: 400, payload: { error: 'A target user id is required.' } };

  const auth = getAuth();
  const userRecord = await auth.getUser(uid);
  const email = normalizeEmail(userRecord.email);

  if (email === SUPER_ADMIN_EMAIL) {
    return { status: 409, payload: { error: 'The permanent Super Admin account cannot be disabled.' } };
  }

  const doc = await getFirestore().collection('users').doc(uid).get();
  const role = (doc.exists && doc.data().role) === 'admin' ? 'admin' : 'customer';
  const displayName =
    (doc.exists && doc.data().displayName) || userRecord.displayName || email.split('@')[0];

  await auth.setCustomUserClaims(uid, { role: role === 'admin' && status === 'active' ? 'admin' : 'customer' });
  await auth.updateUser(uid, { disabled: status === 'inactive' });
  await writeProfile(uid, { email, displayName, role, status, isNewDoc: !doc.exists });

  return {
    status: 200,
    payload: { success: true, message: status === 'active' ? 'Account enabled.' : 'Account disabled.' },
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    initAdmin();
    await requireSuperAdmin(req);

    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return res.status(400).json({ error: 'Request body must be a JSON object.' });
    }

    let result;
    switch (body.action) {
      case 'create-admin':
        result = await handleCreateAdmin(body);
        break;
      case 'set-role':
        result = await handleSetRole(body);
        break;
      case 'set-status':
        result = await handleSetStatus(body);
        break;
      default:
        result = { status: 400, payload: { error: 'Unsupported action.' } };
    }

    return res.status(result.status).json(result.payload);
  } catch (error) {
    // Map common Firebase Admin errors to friendly, safe messages.
    const code = error && error.code;
    if (code === 'auth/id-token-expired' || code === 'auth/id-token-revoked' || code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    }
    if (code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'That user account no longer exists.' });
    }
    if (code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const status = error.status || 500;
    if (status >= 500) {
      console.error('admin-users API error:', error);
    }
    const message =
      status === 500 ? 'Internal server error while managing admin accounts.' : error.message;
    return res.status(status).json({ error: message });
  }
}
