import { useState } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import toast from 'react-hot-toast';

export default function AdminContact() {
  const { contactInfo, updateContactInfo } = useStore();
  const [form, setForm] = useState({ ...contactInfo });

  const handleSave = () => {
    updateContactInfo(form);
    toast.success('Contact settings saved!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Contact Settings</h1>
        <p className="text-stone-500 text-sm">Manage phone numbers, WhatsApp, email, and business information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Phone & Email */}
        <div>
          <h3 className="font-semibold text-stone-900 mb-3">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
              <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <h3 className="font-semibold text-stone-900 mb-3">WhatsApp Numbers</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Sales WhatsApp</label>
              <input type="text" value={form.whatsappSales} onChange={e => setForm({...form, whatsappSales: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Support WhatsApp</label>
              <input type="text" value={form.whatsappSupport} onChange={e => setForm({...form, whatsappSupport: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Bulk Order WhatsApp</label>
              <input type="text" value={form.whatsappBulk} onChange={e => setForm({...form, whatsappBulk: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Address & Hours */}
        <div>
          <h3 className="font-semibold text-stone-900 mb-3">Business Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Address</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Business Hours</label>
              <input type="text" value={form.businessHours} onChange={e => setForm({...form, businessHours: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-stone-900 mb-3">Social Media URLs</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(['facebook', 'instagram', 'pinterest', 'youtube'] as const).map(key => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">{key}</label>
                <input type="url" value={form.socialMedia?.[key] || ''} onChange={e => setForm({...form, socialMedia: {...(form.socialMedia || {facebook:'',instagram:'',pinterest:'',youtube:''}), [key]: e.target.value}})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors text-sm font-medium">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
