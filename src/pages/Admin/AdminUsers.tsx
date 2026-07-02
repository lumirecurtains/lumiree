import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Loader2, ShieldAlert, ShieldCheck, UserPlus, UserRoundX, UserRoundCog } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SUPER_ADMIN_EMAIL } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';

interface AdminApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  resetLink?: string | null;
  alreadyExisted?: boolean;
  uid?: string;
}

async function callAdminApi(
  idToken: string,
  body: Record<string, unknown>,
): Promise<AdminApiResponse> {
  const response = await fetch('/api/admin-users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  let data: AdminApiResponse = {};
  try {
    data = (await response.json()) as AdminApiResponse;
  } catch {
    // Non-JSON response (e.g. platform error page)
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}.`);
  }

  return data;
}

export default function AdminUsers() {
  const { isSuperAdmin, user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', displayName: '' });

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextUsers = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data() as Partial<UserProfile> & { createdAt?: unknown };

        // createdAt may be a Firestore Timestamp (backend writes) or a string.
        let createdAt = new Date().toISOString();
        const rawCreatedAt = data.createdAt;
        if (typeof rawCreatedAt === 'string') {
          createdAt = rawCreatedAt;
        } else if (rawCreatedAt && typeof (rawCreatedAt as { toDate?: () => Date }).toDate === 'function') {
          createdAt = (rawCreatedAt as { toDate: () => Date }).toDate().toISOString();
        }

        return {
          uid: docSnapshot.id,
          email: data.email || '',
          displayName: data.displayName || 'User',
          role: data.role || 'customer',
          status: data.status || 'active',
          wishlist: data.wishlist || [],
          recentlyViewed: data.recentlyViewed || [],
          createdAt,
        } as UserProfile;
      });

      setUsers(nextUsers);
      setLoadingUsers(false);
    }, () => {
      setLoadingUsers(false);
      toast.error('Unable to load admin accounts right now.');
    });

    return () => unsubscribe();
  }, []);

  const handleAddAdmin = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const displayName = form.displayName.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isSuperAdmin || !user) {
      toast.error('Only the Super Admin can add admin accounts.');
      return;
    }

    setAddingAdmin(true);

    try {
      const idToken = await user.getIdToken();
      const result = await callAdminApi(idToken, {
        action: 'create-admin',
        email,
        displayName,
      });

      toast.success(result.message || 'Admin added successfully.');

      if (result.resetLink) {
        try {
          await navigator.clipboard.writeText(result.resetLink);
          toast.success('Password setup link copied to clipboard. Share it with the new admin.', { duration: 8000 });
        } catch {
          toast(`Password setup link: ${result.resetLink}`, { duration: 15000 });
        }
      }

      setForm({ email: '', displayName: '' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to add admin right now.';
      console.error('Add admin failed:', error);
      toast.error(`Add admin failed: ${message}`);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRoleUpdate = async (targetUser: UserProfile, nextRole: 'admin' | 'customer') => {
    if (!isSuperAdmin || !user) return;
    if (targetUser.email === SUPER_ADMIN_EMAIL) {
      toast.error('The permanent Super Admin account cannot be changed.');
      return;
    }

    setActionLoadingId(targetUser.uid);

    try {
      const idToken = await user.getIdToken();
      const result = await callAdminApi(idToken, {
        action: 'set-role',
        uid: targetUser.uid,
        role: nextRole,
      });
      toast.success(result.message || (nextRole === 'admin' ? 'Admin access granted.' : 'Admin access removed.'));
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unable to update this account right now.';
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusUpdate = async (targetUser: UserProfile, nextStatus: 'active' | 'inactive') => {
    if (!isSuperAdmin || !user) return;
    if (targetUser.email === SUPER_ADMIN_EMAIL) {
      toast.error('The permanent Super Admin account cannot be disabled.');
      return;
    }

    setActionLoadingId(targetUser.uid);

    try {
      const idToken = await user.getIdToken();
      const result = await callAdminApi(idToken, {
        action: 'set-status',
        uid: targetUser.uid,
        status: nextStatus,
      });
      toast.success(result.message || (nextStatus === 'active' ? 'Account enabled.' : 'Account disabled.'));
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unable to change this account status.';
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const adminUsers = users.filter((entry) => entry.role === 'admin' || entry.role === 'super_admin');

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">User Management</h1>
        <p className="text-stone-500 text-sm">Manage admin accounts, permissions, and access</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-gold-700" />
            <div>
              <h3 className="font-semibold text-stone-900">Super Admin</h3>
              <p className="text-sm text-stone-600">{SUPER_ADMIN_EMAIL}</p>
              <p className="text-xs text-gold-600 mt-1">Permanent owner • Cannot be deleted, demoted, or disabled</p>
            </div>
          </div>
        </div>

        <div className="border border-stone-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 font-bold">
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div>
              <h4 className="font-medium text-stone-900">{user?.displayName || 'Admin'}</h4>
              <p className="text-sm text-stone-500">{user?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                {isSuperAdmin ? (
                  <span className="text-xs px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Super Admin
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isSuperAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              <strong>Note:</strong> Only the Super Admin ({SUPER_ADMIN_EMAIL}) can create, remove, or modify admin accounts.
            </p>
          </div>
        )}

        {isSuperAdmin && (
          <>
            <form onSubmit={handleAddAdmin} className="bg-stone-50 rounded-lg p-4 border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-stone-900">Add Admin</h3>
                  <p className="text-sm text-stone-500">Create a new admin account using an email address.</p>
                </div>
                <div className="text-gold-700 flex items-center gap-2 text-sm font-medium">
                  <UserPlus className="w-4 h-4" /> Secure invite
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    placeholder="Optional display name"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {addingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {addingAdmin ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-900">Admin Accounts</h3>
                <p className="text-sm text-stone-500">{adminUsers.length} active admin account{adminUsers.length === 1 ? '' : 's'}</p>
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center rounded-lg border border-stone-200 bg-stone-50 py-8 text-sm text-stone-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading admin accounts...
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-stone-200 bg-stone-50 py-8 text-center text-sm text-stone-500">
                  No admin accounts yet.
                </div>
              ) : (
                adminUsers.map((entry) => {
                  const isProtected = entry.email === SUPER_ADMIN_EMAIL;
                  const isDisabled = entry.status === 'inactive';

                  return (
                    <div key={entry.uid} className="rounded-lg border border-stone-200 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 font-semibold text-stone-700">
                            {entry.displayName?.[0] || entry.email?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-stone-900">{entry.displayName}</h4>
                              {isProtected ? (
                                <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-medium text-gold-700">Owner</span>
                              ) : (
                                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isDisabled ? 'bg-stone-100 text-stone-600' : 'bg-blue-100 text-blue-700'}`}>
                                  {isDisabled ? 'Disabled' : 'Admin'}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-stone-500">{entry.email}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {!isProtected && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRoleUpdate(entry, 'customer')}
                                disabled={actionLoadingId === entry.uid}
                                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 disabled:opacity-70"
                              >
                                {actionLoadingId === entry.uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserRoundX className="w-4 h-4" />}
                                Demote
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusUpdate(entry, entry.status === 'active' ? 'inactive' : 'active')}
                                disabled={actionLoadingId === entry.uid}
                                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 disabled:opacity-70"
                              >
                                {actionLoadingId === entry.uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserRoundCog className="w-4 h-4" />}
                                {entry.status === 'active' ? 'Disable' : 'Enable'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
