import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { SUPER_ADMIN_EMAIL } from '@/lib/constants';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeEmail(email?: string | null) {
  return (email || '').trim().toLowerCase();
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export async function upsertUserProfileRecord({
  uid,
  email,
  displayName,
  role,
  status = 'active',
  wishlist = [],
  recentlyViewed = [],
  createdAt,
}: {
  uid: string;
  email: string;
  displayName?: string;
  role: UserProfile['role'];
  status?: UserProfile['status'];
  wishlist?: string[];
  recentlyViewed?: string[];
  createdAt?: unknown;
}): Promise<UserProfile> {
  const normalizedEmail = normalizeEmail(email);
  const normalizedDisplayName = displayName?.trim() || normalizedEmail.split('@')[0] || 'User';

  // createdAt may arrive as an ISO string, a JS Date, or a Firestore Timestamp
  // (documents written by the backend API use serverTimestamp()). Preserve the
  // original Firestore value byte-for-byte so security rules never see a
  // "changed" createdAt on self-updates.
  let createdAtDate = new Date();
  let firestoreCreatedAt: unknown = null;

  if (createdAt instanceof Date && !Number.isNaN(createdAt.getTime())) {
    createdAtDate = createdAt;
    firestoreCreatedAt = createdAt;
  } else if (typeof createdAt === 'string') {
    const parsed = new Date(createdAt);
    if (!Number.isNaN(parsed.getTime())) {
      createdAtDate = parsed;
      firestoreCreatedAt = parsed;
    }
  } else if (
    createdAt &&
    typeof (createdAt as { toDate?: () => Date }).toDate === 'function'
  ) {
    // Firestore Timestamp: keep the exact original value for the write.
    createdAtDate = (createdAt as { toDate: () => Date }).toDate();
    firestoreCreatedAt = createdAt;
  }

  if (firestoreCreatedAt === null) {
    firestoreCreatedAt = createdAtDate;
  }

  const profile: UserProfile = {
    uid,
    email: normalizedEmail,
    displayName: normalizedDisplayName,
    role,
    status,
    wishlist,
    recentlyViewed,
    createdAt: createdAtDate.toISOString(),
  };

  const userRef = doc(db, 'users', uid);

  await setDoc(userRef, {
    ...profile,
    createdAt: firestoreCreatedAt,
  }, { merge: true });

  // emailIndex is super-admin-only per Firestore rules; write best-effort so a
  // permission denial never breaks profile creation for regular users.
  try {
    const emailIndexRef = doc(db, 'emailIndex', normalizedEmail);
    await setDoc(emailIndexRef, {
      uid,
      email: normalizedEmail,
      displayName: normalizedDisplayName,
      role,
      status,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch {
    // Non-fatal: only the Super Admin (or the backend API) maintains emailIndex.
  }

  return profile;
}

// Helper function to get or create user profile in Firestore
async function getOrCreateUserProfile(firebaseUser: User): Promise<UserProfile> {
  const normalizedEmail = normalizeEmail(firebaseUser.email);
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  try {
    let tokenResult = await firebaseUser.getIdTokenResult();
    let claimRole = typeof tokenResult.claims.role === 'string' ? tokenResult.claims.role : null;

    const userSnap = await getDoc(userRef);

    // If the backend granted the admin claim after this session's token was
    // minted (e.g. the user was just promoted), force one refresh so Firestore/
    // Storage rules and role checks see the new claim without a re-login.
    if (claimRole !== 'admin' && claimRole !== 'super_admin') {
      const profileRole = userSnap.exists() ? (userSnap.data() as Partial<UserProfile>).role : undefined;
      if (profileRole === 'admin') {
        tokenResult = await firebaseUser.getIdTokenResult(true);
        claimRole = typeof tokenResult.claims.role === 'string' ? tokenResult.claims.role : null;
      }
    }

    const isSuperAdminEmail = normalizedEmail === normalizeEmail(SUPER_ADMIN_EMAIL);
    const desiredRole = isSuperAdminEmail ? 'super_admin' : claimRole === 'super_admin' ? 'super_admin' : claimRole === 'admin' ? 'admin' : 'customer';

    if (userSnap.exists()) {
      const data = userSnap.data() as Partial<UserProfile>;
      const nextRole = isSuperAdminEmail ? 'super_admin' : (data.role ?? desiredRole);
      const nextStatus = isSuperAdminEmail ? 'active' : (data.status ?? 'active');
      const nextDisplayName = data.displayName || firebaseUser.displayName || normalizedEmail.split('@')[0] || 'User';

      if (nextRole !== data.role || nextStatus !== data.status || nextDisplayName !== data.displayName) {
        return upsertUserProfileRecord({
          uid: firebaseUser.uid,
          email: normalizedEmail,
          displayName: nextDisplayName,
          role: nextRole,
          status: nextStatus,
          wishlist: data.wishlist || [],
          recentlyViewed: data.recentlyViewed || [],
          createdAt: data.createdAt,
        });
      }
      
      return {
        uid: firebaseUser.uid,
        email: normalizedEmail,
        displayName: nextDisplayName,
        role: nextRole,
        status: nextStatus,
        wishlist: data.wishlist || [],
        recentlyViewed: data.recentlyViewed || [],
        createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
      } as UserProfile;
    }

    return upsertUserProfileRecord({
      uid: firebaseUser.uid,
      email: normalizedEmail,
      displayName: firebaseUser.displayName || normalizedEmail.split('@')[0] || 'User',
      role: desiredRole,
      status: 'active',
      wishlist: [],
      recentlyViewed: [],
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    throw new Error('Unable to read or create user profile in Firestore.');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed properties for role checks
  const normalizedUserEmail = normalizeEmail(user?.email);
  const isSuperAdmin = userProfile?.role === 'super_admin' || normalizedUserEmail === normalizeEmail(SUPER_ADMIN_EMAIL);
  const isAdmin = isSuperAdmin || (userProfile?.role === 'admin' && userProfile?.status === 'active');

  useEffect(() => {
    // Set persistence to LOCAL (survives browser restart)
    setPersistence(auth, browserLocalPersistence).catch(console.error);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await getOrCreateUserProfile(firebaseUser);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    // Profile will be loaded by onAuthStateChanged
  };

  const signUp = async (email: string, password: string, name: string) => {
    await setPersistence(auth, browserLocalPersistence);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // Profile will be created by onAuthStateChanged via getOrCreateUserProfile
  };

  const signInWithGoogle = async () => {
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    await signInWithPopup(auth, provider);
    // Profile will be created by onAuthStateChanged via getOrCreateUserProfile
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, 
      userProfile, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      signOut, 
      isSuperAdmin, 
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}
