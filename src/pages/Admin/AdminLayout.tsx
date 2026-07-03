import { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Package, MessageSquare, Users, Star, HelpCircle, 
  Settings, Menu, X, ChevronRight, ShieldCheck, Image, Phone, MessageSquareText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { to: '/admin/reviews', icon: MessageSquareText, label: 'Reviews' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/contact', icon: Phone, label: 'Contact Settings' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { isAdmin, isSuperAdmin, user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-800 rounded-sm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-heading font-bold text-2xl">L</span>
          </div>
          <p className="text-stone-500 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-stone-900 transform transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-stone-800">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-700 rounded-sm flex items-center justify-center">
              <span className="text-white font-heading font-bold">L</span>
            </div>
            <div>
              <p className="text-white font-heading font-bold text-sm leading-none">Curtavra</p>
              <p className="text-[9px] text-gold-400 uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-stone-800 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.displayName?.[0] || user?.email?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.displayName || 'Admin'}</p>
                <p className="text-[10px] text-gold-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = item.exact 
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-gold-600 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-stone-400 hover:text-white text-sm transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-stone-600 hidden md:block">
                Admin Dashboard
              </h2>
            </div>
            <Link to="/" className="text-sm text-gold-700 hover:underline">View Store →</Link>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
