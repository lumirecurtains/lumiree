// End-to-end tests for api/admin-users.js against the Firebase emulators.
// Usage: firebase emulators:exec --only auth,firestore --project demo-lumiree "node tests/api.e2e.test.mjs"
//
// The Admin SDK auto-connects to emulators via FIREBASE_AUTH_EMULATOR_HOST /
// FIRESTORE_EMULATOR_HOST, which emulators:exec sets automatically.

process.env.FIREBASE_PROJECT_ID = 'demo-lumiree';
process.env.FIREBASE_CLIENT_EMAIL = 'test@demo-lumiree.iam.gserviceaccount.com';
// Any structurally valid key works against emulators (no real signing needed
// for verifyIdToken in emulator mode).
const { generateKeyPairSync } = await import('node:crypto');
process.env.FIREBASE_PRIVATE_KEY = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey.replace(/\n/g, '\\n');

const SUPER_EMAIL = 'lexcorp0777@gmail.com';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

const handler = (await import('../api/admin-users.js')).default;
const { initializeApp, cert, getApps } = await import('firebase-admin/app');
const { getAuth } = await import('firebase-admin/auth');
const { getFirestore } = await import('firebase-admin/firestore');

// Initialize the same default app the handler would create lazily.
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

let passed = 0;
let failed = 0;
function check(name, cond, extra = '') {
  if (cond) { passed += 1; console.log(`  ✓ ${name}`); }
  else { failed += 1; console.error(`  ✗ ${name} ${extra}`); }
}

function makeRes() {
  const res = { headers: {}, statusCode: null, body: null };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
}

async function call(idToken, body) {
  const res = makeRes();
  await handler(
    { method: 'POST', headers: idToken ? { authorization: `Bearer ${idToken}` } : {}, body },
    res,
  );
  return res;
}

// Sign in against the Auth emulator to obtain a real (emulator) ID token.
async function signIn(email, password) {
  const r = await fetch(
    `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const data = await r.json();
  if (!r.ok) throw new Error(`signIn failed: ${JSON.stringify(data)}`);
  return data.idToken;
}

const adminAuth = getAuth();
const db = getFirestore();

console.log('setup: create Super Admin + a customer');
const superUser = await adminAuth.createUser({ email: SUPER_EMAIL, password: 'Super#12345' });
await db.collection('users').doc(superUser.uid).set({
  uid: superUser.uid, email: SUPER_EMAIL, displayName: 'Owner', role: 'super_admin',
  status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date(),
});
const customerUser = await adminAuth.createUser({ email: 'customer@x.com', password: 'Cust#12345' });
await db.collection('users').doc(customerUser.uid).set({
  uid: customerUser.uid, email: 'customer@x.com', displayName: 'Cust', role: 'customer',
  status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date(),
});
const superToken = await signIn(SUPER_EMAIL, 'Super#12345');
const customerToken = await signIn('customer@x.com', 'Cust#12345');

console.log('1. create-admin: brand-new email');
let res = await call(superToken, { action: 'create-admin', email: 'NewAdmin@X.com ', displayName: 'New Admin' });
check('returns 200', res.statusCode === 200, JSON.stringify(res.body));
check('alreadyExisted=false', res.body.alreadyExisted === false);
const newUid = res.body.uid;
let authUser = await adminAuth.getUser(newUid);
check('auth user created with normalized email', authUser.email === 'newadmin@x.com');
check('custom claim role=admin set', authUser.customClaims?.role === 'admin');
let userDoc = await db.collection('users').doc(newUid).get();
check('users/{uid} doc created', userDoc.exists);
check('role=admin', userDoc.data().role === 'admin');
check('status=active', userDoc.data().status === 'active');
check('wishlist array present', Array.isArray(userDoc.data().wishlist));
let idxDoc = await db.collection('emailIndex').doc('newadmin@x.com').get();
check('emailIndex synchronized', idxDoc.exists && idxDoc.data().uid === newUid);

console.log('2. create-admin: idempotency (same email again)');
res = await call(superToken, { action: 'create-admin', email: 'newadmin@x.com' });
check('returns 200 again', res.statusCode === 200, JSON.stringify(res.body));
check('alreadyExisted=true', res.body.alreadyExisted === true);
check('same uid (no duplicate user)', res.body.uid === newUid);
const allUsers = await adminAuth.listUsers();
check('no duplicate auth accounts', allUsers.users.filter(u => u.email === 'newadmin@x.com').length === 1);

console.log('3. create-admin: repair orphaned Auth account (no Firestore doc)');
const orphan = await adminAuth.createUser({ email: 'orphan@x.com', password: 'Orphan#123' });
res = await call(superToken, { action: 'create-admin', email: 'orphan@x.com', displayName: 'Repaired' });
check('returns 200', res.statusCode === 200, JSON.stringify(res.body));
check('reuses orphan uid', res.body.uid === orphan.uid);
userDoc = await db.collection('users').doc(orphan.uid).get();
check('missing users doc repaired', userDoc.exists && userDoc.data().role === 'admin');
authUser = await adminAuth.getUser(orphan.uid);
check('orphan got admin claim', authUser.customClaims?.role === 'admin');

console.log('4. create-admin: promote existing customer');
res = await call(superToken, { action: 'create-admin', email: 'customer@x.com' });
check('returns 200', res.statusCode === 200, JSON.stringify(res.body));
userDoc = await db.collection('users').doc(customerUser.uid).get();
check('customer promoted to admin', userDoc.data().role === 'admin');
check('displayName preserved', userDoc.data().displayName === 'Cust');
authUser = await adminAuth.getUser(customerUser.uid);
check('claim applied to promoted user', authUser.customClaims?.role === 'admin');

console.log('5. guards');
res = await call(superToken, { action: 'create-admin', email: SUPER_EMAIL });
check('cannot re-add super admin (409)', res.statusCode === 409);
res = await call(superToken, { action: 'create-admin', email: 'not-an-email' });
check('invalid email rejected (400)', res.statusCode === 400);
res = await call(customerToken, { action: 'create-admin', email: 'evil@x.com' });
check('customer caller rejected (403)', res.statusCode === 403, JSON.stringify(res.body));
res = await call(null, { action: 'create-admin', email: 'x@y.com' });
check('missing token rejected (401)', res.statusCode === 401);
res = await call(superToken, { action: 'unknown-action' });
check('unknown action rejected (400)', res.statusCode === 400);

console.log('6. admin caller (not super admin) is rejected');
const adminToken = await signIn('customer@x.com', 'Cust#12345'); // now role=admin in doc, but not super_admin
res = await call(adminToken, { action: 'create-admin', email: 'another@x.com' });
check('plain admin cannot add admins (403)', res.statusCode === 403, JSON.stringify(res.body));

console.log('7. set-role: demote');
res = await call(superToken, { action: 'set-role', uid: newUid, role: 'customer' });
check('returns 200', res.statusCode === 200, JSON.stringify(res.body));
userDoc = await db.collection('users').doc(newUid).get();
check('role now customer', userDoc.data().role === 'customer');
authUser = await adminAuth.getUser(newUid);
check('claim downgraded', authUser.customClaims?.role === 'customer');
res = await call(superToken, { action: 'set-role', uid: superUser.uid, role: 'customer' });
check('cannot demote super admin (409)', res.statusCode === 409);

console.log('8. set-status: disable');
res = await call(superToken, { action: 'set-status', uid: orphan.uid, status: 'inactive' });
check('returns 200', res.statusCode === 200, JSON.stringify(res.body));
userDoc = await db.collection('users').doc(orphan.uid).get();
check('status=inactive in Firestore', userDoc.data().status === 'inactive');
authUser = await adminAuth.getUser(orphan.uid);
check('auth account disabled', authUser.disabled === true);
check('claim revoked while disabled', authUser.customClaims?.role === 'customer');
res = await call(superToken, { action: 'set-status', uid: orphan.uid, status: 'active' });
authUser = await adminAuth.getUser(orphan.uid);
check('re-enable restores account', res.statusCode === 200 && authUser.disabled === false);
check('re-enable restores admin claim', authUser.customClaims?.role === 'admin');
res = await call(superToken, { action: 'set-status', uid: superUser.uid, status: 'inactive' });
check('cannot disable super admin (409)', res.statusCode === 409);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
