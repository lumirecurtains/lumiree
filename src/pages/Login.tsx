import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEOHead from '@/components/SEOHead';
import toast from 'react-hot-toast';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/email-already-in-use': 'An account with that email already exists. Try signing in.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups and retry.',
};

function mapAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return error instanceof Error && !error.message.startsWith('Firebase:')
    ? error.message
    : 'Authentication failed. Please try again.';
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Welcome back!');
      } else {
        await signUp(email, password, name);
        toast.success('Account created!');
      }
      // Redirect handled by the `user` effect above (admin → /admin, else → /)
    } catch (error: unknown) {
      toast.error(mapAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome!');
      // Redirect handled by the `user` effect above
    } catch (error: unknown) {
      // Popup closed by the user is not an error worth toasting
      const code = (error as { code?: string })?.code || '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        toast.error(mapAuthError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-16 px-4">
      <SEOHead title="Sign In | Curtavra" description="Sign in to your Curtavra account." canonical="/login" noindex />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-600 to-gold-800 rounded-sm flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading text-2xl font-bold text-stone-900">Curtavra</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-stone-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-stone-500 mt-1">{isLogin ? 'Sign in to your account' : 'Join Curtavra for exclusive access'}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="••••••••" minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="w-full px-6 py-3.5 bg-gold-700 text-white font-semibold rounded-lg hover:bg-gold-800 transition-colors disabled:opacity-50">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-stone-400">or</span></div>
            </div>
            <button onClick={handleGoogle} disabled={loading} className="w-full px-6 py-3 border border-stone-200 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-stone-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => setIsLogin(!isLogin)} className="text-gold-700 hover:underline ml-1 font-medium">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
