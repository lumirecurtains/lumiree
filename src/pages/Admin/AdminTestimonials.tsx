import { useState } from 'react';
import { Plus, Edit, Trash2, Star, X, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Testimonial } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5, image: '', featured: true });

  const handleSave = async () => {
    if (!form.name || !form.text) { toast.error('Name and text are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing.id, form);
        toast.success('Testimonial updated!');
      } else {
        await addTestimonial({ ...form, id: `t-${Date.now()}` });
        toast.success('Testimonial added!');
      }
      setEditing(null);
      setCreating(false);
      setForm({ name: '', role: '', text: '', rating: 5, image: '', featured: true });
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial.');
    }
    setSaving(false);
  };

  const handleToggleFeatured = async (t: Testimonial) => {
    try {
      await updateTestimonial(t.id, { featured: !t.featured });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        toast.success('Deleted');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete.');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Testimonials</h1>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">{editing ? 'Edit' : 'Add'} Testimonial</h3>
            <button onClick={() => { setCreating(false); setEditing(null); }}><X className="w-5 h-5 text-stone-400" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Customer Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            <input type="text" placeholder="Role (e.g., Homeowner)" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
          </div>
          <textarea placeholder="Testimonial text *" value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={3} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none mb-4" />
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input type="url" placeholder="Customer photo URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            <select value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white">
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Show on Homepage
            </label>
          </div>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
            {t.image && <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-stone-900">{t.name}</h3>
                <span className="text-xs text-stone-500">{t.role}</span>
                {t.featured && <span className="text-xs px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">Featured</span>}
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({length: 5}).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />)}
              </div>
              <p className="text-sm text-stone-600">"{t.text}"</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleToggleFeatured(t)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400" title={t.featured ? 'Hide' : 'Show'}>
                {t.featured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => { setEditing(t); setForm({...t}); setCreating(false); }} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
