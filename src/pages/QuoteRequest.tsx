import { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import SEOHead from '@/components/SEOHead';
import toast from 'react-hot-toast';
import { formatINR } from '@/utils/currency';

export default function QuoteRequest() {
  const { addInquiry } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', rooms: '', budget: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addInquiry({
        id: `inq-${Date.now()}`, type: 'quote', name: form.name, email: form.email, phone: form.phone,
        message: `Quote Request: Rooms: ${form.rooms}, Budget: ${form.budget}. ${form.message}`,
        status: 'new', createdAt: new Date().toISOString(),
      });
      toast.success('Quote request submitted! We\'ll send your personalized quote within 24 hours.');
      setForm({ name: '', email: '', phone: '', rooms: '', budget: '', message: '' });
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit. Please try again.');
    }
  };

  return (
    <div>
      <SEOHead title="Get a Free Curtain Quote | LuxDrape Begusarai, Bihar" description="Request a free personalized curtain quote from LuxDrape. Custom sizing, fabric selection, and professional installation across Begusarai & Bihar." canonical="/quote-request" />
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Free Quote</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Request a Quote</h1>
          <p className="text-stone-400">Get a personalized curtain quote tailored to your needs and budget.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Number of Rooms</label>
                <select value={form.rooms} onChange={e => setForm({...form, rooms: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="">Select</option>
                  <option>1 Room</option>
                  <option>2-3 Rooms</option>
                  <option>4-6 Rooms</option>
                  <option>Whole House</option>
                  <option>Commercial/Hotel</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Budget Range</label>
              <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                <option value="">Select budget</option>
                <option>Under {formatINR(5000)}</option>
                <option>{formatINR(5000)} - {formatINR(15000)}</option>
                <option>{formatINR(15000)} - {formatINR(30000)}</option>
                <option>{formatINR(30000)} - {formatINR(50000)}</option>
                <option>{formatINR(50000)}+</option>
                <option>Need recommendation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tell us about your curtain needs *</label>
              <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none" placeholder="Describe the rooms, window sizes, preferred styles, colors..." />
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-gold-700 text-white font-semibold rounded-lg hover:bg-gold-800 transition-colors">
              <Send className="w-4 h-4" /> Get My Free Quote
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
