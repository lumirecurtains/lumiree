import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { FAQ } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminFAQs() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useStore();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general' });

  const handleSave = async () => {
    if (!form.question || !form.answer) { toast.error('Question and answer are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateFaq(editing.id, form);
        toast.success('FAQ updated!');
      } else {
        await addFaq({ ...form, id: `f-${Date.now()}` });
        toast.success('FAQ added!');
      }
      setEditing(null); 
      setCreating(false);
      setForm({ question: '', answer: '', category: 'general' });
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this FAQ?')) {
      try {
        await deleteFaq(id);
        toast.success('Deleted');
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast.error('Failed to delete.');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">FAQs</h1>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">{editing ? 'Edit' : 'Add'} FAQ</h3>
            <button onClick={() => { setCreating(false); setEditing(null); }}><X className="w-5 h-5 text-stone-400" /></button>
          </div>
          <input type="text" placeholder="Question *" value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm mb-3" />
          <textarea placeholder="Answer *" value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} rows={3} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none mb-3" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white mb-4">
            <option value="general">General</option>
            <option value="products">Products</option>
            <option value="custom">Custom Orders</option>
            <option value="installation">Installation</option>
            <option value="pricing">Pricing</option>
            <option value="delivery">Delivery</option>
            <option value="care">Care</option>
            <option value="policies">Policies</option>
          </select>
          <div>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map(faq => (
          <div key={faq.id} className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-stone-900 mb-1">{faq.question}</h3>
              <p className="text-sm text-stone-600">{faq.answer}</p>
              <span className="text-xs text-stone-400 capitalize mt-2 inline-block">{faq.category}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => { setEditing(faq); setForm({...faq}); setCreating(false); }} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(faq.id)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
