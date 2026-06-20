import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SUPER_ADMIN_EMAIL } from '@/lib/constants';

export default function AdminUsers() {
  const { isSuperAdmin, user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">User Management</h1>
        <p className="text-stone-500 text-sm">Manage admin accounts and customer access</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Super Admin Info */}
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-gold-700" />
            <div>
              <h3 className="font-semibold text-stone-900">Super Admin</h3>
              <p className="text-sm text-stone-600">{SUPER_ADMIN_EMAIL}</p>
              <p className="text-xs text-gold-600 mt-1">Permanent owner • Cannot be deleted or demoted</p>
            </div>
          </div>
        </div>

        {/* Current User */}
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
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              <strong>Note:</strong> Only the Super Admin ({SUPER_ADMIN_EMAIL}) can create/remove admin accounts and modify global permissions.
            </p>
          </div>
        )}

        {isSuperAdmin && (
          <div className="mt-6 bg-stone-50 rounded-lg p-6 text-center">
            <h3 className="font-heading font-semibold text-stone-900 mb-2">Admin Management</h3>
            <p className="text-sm text-stone-500 mb-4">
              Connect Firebase to manage admin accounts. New users who sign in with the Super Admin email 
              ({SUPER_ADMIN_EMAIL}) are automatically granted full admin access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
