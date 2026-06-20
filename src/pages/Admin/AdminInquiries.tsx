import { MessageSquare, Mail, Phone, Clock } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import toast from 'react-hot-toast';

export default function AdminInquiries() {
  const { inquiries, updateInquiryStatus } = useStore();

  const handleStatusChange = (id: string, status: any) => {
    updateInquiryStatus(id, status);
    toast.success(`Status updated to ${status}`);
  };

  const statusColors: Record<string, string> = {
    new: 'bg-amber-100 text-amber-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    closed: 'bg-stone-100 text-stone-700',
  };

  const typeIcons: Record<string, string> = {
    product: '🛒',
    quote: '📋',
    installation: '🔧',
    bulk: '📦',
    general: '💬',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Inquiries</h1>
        <p className="text-stone-500 text-sm">{inquiries.length} total inquiries • {inquiries.filter(i => i.status === 'new').length} new</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-semibold text-stone-900 mb-1">No Inquiries Yet</h3>
          <p className="text-stone-500 text-sm">Customer inquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeIcons[inq.type] || '💬'}</span>
                  <div>
                    <h3 className="font-medium text-stone-900">{inq.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inq.email}</span>
                      {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inq.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={inq.status}
                    onChange={e => handleStatusChange(inq.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${statusColors[inq.status]}`}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg">{inq.message}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(inq.createdAt).toLocaleString()}
                </span>
                <span className="text-xs capitalize px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">{inq.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
