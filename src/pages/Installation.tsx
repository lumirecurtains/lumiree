import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { STOCK_IMAGES } from '@/lib/constants';
import SEOHead from '@/components/SEOHead';
import toast from 'react-hot-toast';
import { formatINR } from '@/utils/currency';

export default function Installation() {
  const { addInquiry } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', date: '', notes: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addInquiry({
        id: `inq-${Date.now()}`, type: 'installation', name: form.name, email: form.email, phone: form.phone,
        message: `Installation Request: Address: ${form.address}, Date: ${form.date}. Notes: ${form.notes}`,
        status: 'new', createdAt: new Date().toISOString(),
      });
      toast.success('Installation request submitted!');
      setForm({ name: '', email: '', phone: '', address: '', date: '', notes: '' });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit. Please try again.');
    }
  };

  return (
    <div>
      <SEOHead title="Curtain Installation Service in Begusarai & Bihar | Curtavra" description="Professional curtain installation in Begusarai, Patna & across Bihar. Free measurement, rod fitting, curtain hanging & styling. Book online or via WhatsApp." canonical="/installation" />
      <div className="relative h-[40vh] overflow-hidden">
        <img src={STOCK_IMAGES.elegant} alt="Professional curtain installation in Begusarai Bihar" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Professional Service</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Installation Service</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl font-bold text-stone-900 mb-6">Expert Curtain Installation</h2>
            <p className="text-stone-600 leading-relaxed mb-6">Our professional installation team ensures your curtains are hung perfectly. We handle everything from rod/track fitting to final styling.</p>
            
            <div className="space-y-4 mb-8">
              {['Free in-home measurement', 'Professional rod & track installation', 'Curtain hanging & styling', 'Hardware included', 'Clean-up & old curtain removal', 'Satisfaction guaranteed'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0" />
                  <span className="text-stone-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-gold-50 p-6 rounded-xl">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-2">Installation Pricing</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Standard Installation (1-3 windows): Starting from {formatINR(1500)}</li>
                <li>• Full Room Installation (4-6 windows): Starting from {formatINR(3500)}</li>
                <li>• Whole House: Custom quote available</li>
                <li>• Commercial/Hotel: Special bulk pricing</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="font-heading text-xl font-bold text-stone-900 mb-6">Book Installation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Full Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <input type="email" required placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <input type="tel" required placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <input type="text" required placeholder="Installation Address *" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              <textarea placeholder="Additional details..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none" />
              <button type="submit" className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gold-700 text-white font-semibold rounded-lg hover:bg-gold-800 transition-colors">
                <Send className="w-4 h-4" /> Book Installation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
