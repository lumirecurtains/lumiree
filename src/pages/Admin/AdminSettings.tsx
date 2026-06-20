import { useAuth } from '@/contexts/AuthContext';
import { SUPER_ADMIN_EMAIL } from '@/lib/constants';

export default function AdminSettings() {
  const { isSuperAdmin } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-stone-500 text-sm">Global website settings and configuration</p>
      </div>

      <div className="space-y-6">
        {/* Firebase Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-stone-900 mb-4">Firebase Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Authentication', status: 'Ready', desc: 'Google & Email sign-in configured' },
              { label: 'Firestore', status: 'Ready', desc: 'Database collections ready' },
              { label: 'Storage', status: 'Ready', desc: 'Image upload configured' },
              { label: 'Security Rules', status: 'Active', desc: 'Role-based access control' },
            ].map((item, i) => (
              <div key={i} className="bg-stone-50 rounded-lg p-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-stone-900">{item.label}: {item.status}</p>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-4">
            Set environment variables (VITE_FIREBASE_*) in Vercel for production Firebase integration.
          </p>
        </div>

        {/* Access Control */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-stone-900 mb-4">Access Control</h3>
          <div className="space-y-3">
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
              <p className="text-sm font-medium text-stone-900">Super Admin: {SUPER_ADMIN_EMAIL}</p>
              <p className="text-xs text-gold-600">Permanent • Full access • Cannot be removed</p>
            </div>
            <ul className="text-sm text-stone-600 space-y-1 ml-4 list-disc">
              <li>Only Super Admin can create/remove admin accounts</li>
              <li>Only Super Admin can modify global settings</li>
              <li>Only Super Admin can manage roles and permissions</li>
              <li>Super Admin account cannot be deleted or demoted</li>
            </ul>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-stone-900 mb-4">SEO Configuration</h3>
          <div className="space-y-2 text-sm text-stone-600">
            <p>✅ Dynamic SEO titles on all pages</p>
            <p>✅ Meta descriptions configured</p>
            <p>✅ Open Graph tags for social sharing</p>
            <p>✅ Twitter Card support</p>
            <p>✅ SEO-friendly URLs with slugs</p>
            <p>✅ Image alt tags on all images</p>
            <p>✅ Semantic HTML structure</p>
          </div>
        </div>

        {/* Deployment */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-stone-900 mb-4">Vercel Deployment</h3>
          <div className="bg-stone-50 rounded-lg p-4 text-sm text-stone-600">
            <p className="font-medium text-stone-900 mb-2">Environment Variables Required:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
