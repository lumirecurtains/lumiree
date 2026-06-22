import { Package, MessageSquare, Star, TrendingUp, IndianRupee, MessageSquareText, Settings } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Link } from 'react-router-dom';
import { formatINR } from '@/utils/currency';

export default function Dashboard() {
  const { products, inquiries, reviews, wishlist } = useStore();

  const totalProducts = products.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.salePrice || p.price) * (p.reviewCount || 1), 0);

  const stats = [
    { icon: Package, label: 'Total Products', value: totalProducts, color: 'bg-blue-100 text-blue-700', link: '/admin/products' },
    { icon: MessageSquare, label: 'New Inquiries', value: newInquiries, color: 'bg-amber-100 text-amber-700', link: '/admin/inquiries' },
    { icon: MessageSquareText, label: 'Pending Reviews', value: pendingReviews, color: 'bg-emerald-100 text-emerald-700', link: '/admin/reviews' },
    { icon: IndianRupee, label: 'Est. Value', value: formatINR(totalRevenue), color: 'bg-purple-100 text-purple-700', link: '/admin/products' },
  ];

  const recentInquiries = inquiries.slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm">Welcome to your LuxDrape admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-xs text-stone-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-stone-900">Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="text-sm text-gold-700 hover:underline">View All</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-stone-400 text-sm py-4">No inquiries yet</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map(inq => (
                <div key={inq.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${inq.status === 'new' ? 'bg-amber-500' : inq.status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{inq.name}</p>
                    <p className="text-xs text-stone-500 capitalize">{inq.type} • {new Date(inq.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    inq.status === 'new' ? 'bg-amber-100 text-amber-700' : 
                    inq.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>{inq.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-stone-900">Popular Products</h3>
            <Link to="/admin/products" className="text-sm text-gold-700 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <span className="text-xs font-bold text-stone-400 w-5">#{i + 1}</span>
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                  <p className="text-xs text-stone-500">{p.reviewCount} reviews • ⭐ {p.rating}</p>
                </div>
                <p className="text-sm font-bold text-stone-900">{formatINR(p.salePrice || p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Add Product', to: '/admin/products', color: 'bg-blue-600' },
          { icon: MessageSquareText, label: 'Moderate Reviews', to: '/admin/reviews', color: 'bg-amber-600' },
          { icon: MessageSquare, label: 'View Inquiries', to: '/admin/inquiries', color: 'bg-green-600' },
          { icon: Settings, label: 'Settings', to: '/admin/settings', color: 'bg-purple-600' },
        ].map((action, i) => (
          <Link key={i} to={action.to} className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity text-center`}>
            <action.icon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">{action.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
