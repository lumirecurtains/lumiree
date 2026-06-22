import { useState } from 'react';
import { Star, Check, X, Trash2, Edit, Clock, CheckCircle2, XCircle, Search, MessageSquareText } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Review } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const { reviews, updateReview, deleteReview, products } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editing, setEditing] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ userName: '', title: '', text: '', rating: 5 });
  const [search, setSearch] = useState('');

  const filtered = reviews.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || r.userName.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  const handleApprove = async (id: string) => {
    try {
      await updateReview(id, { status: 'approved' });
      toast.success('Review approved and is now visible on the website.');
    } catch (error) {
      toast.error('Failed to approve review.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateReview(id, { status: 'rejected' });
      toast.success('Review rejected.');
    } catch (error) {
      toast.error('Failed to reject review.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this review?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted.');
    } catch (error) {
      toast.error('Failed to delete review.');
    }
  };

  const openEdit = (r: Review) => {
    setEditing(r);
    setEditForm({ userName: r.userName, title: r.title, text: r.text, rating: r.rating });
  };

  const handleEditSave = async () => {
    if (!editing) return;
    try {
      await updateReview(editing.id, editForm);
      toast.success('Review updated.');
      setEditing(null);
    } catch (error) {
      toast.error('Failed to update review.');
    }
  };

  const getProductName = (productId: string) => {
    if (!productId) return 'General Review';
    const p = products.find(pr => pr.id === productId);
    return p ? p.name : 'Unknown Product';
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Pending</span>;
      case 'approved': return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" />Approved</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Rejected</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Review Management</h1>
        <p className="text-stone-500 text-sm">{reviews.length} total • {pendingCount} pending approval</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'All', value: reviews.length, key: 'all' as const, color: 'bg-stone-100 text-stone-700' },
          { label: 'Pending', value: pendingCount, key: 'pending' as const, color: 'bg-amber-100 text-amber-700' },
          { label: 'Approved', value: approvedCount, key: 'approved' as const, color: 'bg-green-100 text-green-700' },
          { label: 'Rejected', value: rejectedCount, key: 'rejected' as const, color: 'bg-red-100 text-red-700' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`p-3 rounded-xl text-center transition-all ${filter === s.key ? s.color + ' ring-2 ring-offset-1 ring-stone-300' : 'bg-white hover:bg-stone-50'}`}
          >
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input type="text" placeholder="Search reviews by name, title, or text..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-500" />
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gold-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">Edit Review</h3>
            <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-stone-400" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Customer Name</label>
              <input type="text" value={editForm.userName} onChange={e => setEditForm({...editForm, userName: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
              <div className="flex gap-1 py-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setEditForm({...editForm, rating: n})}>
                    <Star className={`w-6 h-6 cursor-pointer ${n <= editForm.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">Review Title</label>
            <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">Review Text</label>
            <textarea value={editForm.text} onChange={e => setEditForm({...editForm, text: e.target.value})} rows={3} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleEditSave} className="px-5 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 text-sm font-medium">Save Changes</button>
            <button onClick={() => setEditing(null)} className="px-5 py-2 border border-stone-200 rounded-lg text-sm hover:bg-stone-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <MessageSquareText className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-semibold text-stone-900 mb-1">No Reviews Found</h3>
          <p className="text-stone-500 text-sm">{filter !== 'all' ? 'Try a different filter.' : 'Customer reviews will appear here.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-xl shadow-sm p-5 border ${r.status === 'pending' ? 'border-amber-200' : 'border-stone-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-stone-900">{r.userName}</h3>
                    {statusBadge(r.status)}
                    {r.userEmail && <span className="text-xs text-stone-400">{r.userEmail}</span>}
                  </div>
                  <p className="text-xs text-stone-400 mb-2">
                    {getProductName(r.productId)} • {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({length: 5}).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />)}
                  </div>
                  {r.title && <p className="text-sm font-medium text-stone-800 mb-1">{r.title}</p>}
                  <p className="text-sm text-stone-600">{r.text}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(r.id)} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Approve"><Check className="w-4 h-4" /></button>
                      <button onClick={() => handleReject(r.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Reject"><X className="w-4 h-4" /></button>
                    </>
                  )}
                  {r.status === 'rejected' && (
                    <button onClick={() => handleApprove(r.id)} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Re-approve"><Check className="w-4 h-4" /></button>
                  )}
                  {r.status === 'approved' && (
                    <button onClick={() => handleReject(r.id)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600" title="Revoke"><XCircle className="w-4 h-4" /></button>
                  )}
                  <button onClick={() => openEdit(r)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-blue-600" title="Edit"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
