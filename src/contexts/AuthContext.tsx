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
  updateDoc,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Helper function to get or create user profile in Firestore
async function getOrCreateUserProfile(firebaseUser: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      
      // CRITICAL: Super Admin Protection
      // If user email is SUPER_ADMIN_EMAIL, ALWAYS ensure role is super_admin
      // This cannot be overridden, demoted, or changed
      if (firebaseUser.email === SUPER_ADMIN_EMAIL && data.role !== 'super_admin') {
        await updateDoc(userRef, { 
          role: 'super_admin',
          status: 'active' // Super admin can never be blocked
        });
        return { ...data, role: 'super_admin', status: 'active' };
      }
      
      return data;
    } else {
      // Create new user profile
      // CRITICAL: Check if this is the SUPER_ADMIN email
      const isSuperAdmin = firebaseUser.email === SUPER_ADMIN_EMAIL;
      
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: isSuperAdmin ? 'super_admin' : 'customer',
        status: 'active',
        wishlist: [],
        recentlyViewed: [],
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
      });
      
      return newProfile;
    }
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    
    // Fallback to localStorage if Firestore fails (offline mode)
    const localProfiles = localStorage.getItem('luxdrape_profiles');
    const profiles = localProfiles ? JSON.parse(localProfiles) : {};
    
    if (profiles[firebaseUser.uid]) {
      const profile = profiles[firebaseUser.uid];
      // Still enforce Super Admin protection
      if (firebaseUser.email === SUPER_ADMIN_EMAIL) {
        profile.role = 'super_admin';
        profile.status = 'active';
      }
      return profile;
    }
    
    // Create local profile as fallback
    const isSuperAdmin = firebaseUser.email === SUPER_ADMIN_EMAIL;
    const fallbackProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'User',
      role: isSuperAdmin ? 'super_admin' : 'customer',
      status: 'active',
      wishlist: [],
      recentlyViewed: [],
      createdAt: new Date().toISOString(),
    };
    
    profiles[firebaseUser.uid] = fallbackProfile;
    localStorage.setItem('luxdrape_profiles', JSON.stringify(profiles));
    
    return fallbackProfile;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed properties for role checks
  const isSuperAdmin = userProfile?.role === 'super_admin' || user?.email === SUPER_ADMIN_EMAIL;
  const isAdmin = isSuperAdmin || userProfile?.role === 'admin';

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
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Profile will be loaded by onAuthStateChanged
    return;
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
