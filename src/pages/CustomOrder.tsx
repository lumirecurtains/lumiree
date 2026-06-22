import { useState } from 'react';
import { Send, Ruler, Palette, Layers } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { MATERIALS, CURTAIN_STYLES, ROD_TYPES, PLEAT_STYLES, COLORS, STOCK_IMAGES } from '@/lib/constants';
import SEOHead from '@/components/SEOHead';
import toast from 'react-hot-toast';

export default function CustomOrder() {
  const { addInquiry, contactInfo } = useStore();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', width: '', height: '',
    fabric: '', style: '', rodType: '', layers: 'Single', pleatStyle: '',
    quantity: '1', notes: '', room: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addInquiry({
        id: `inq-${Date.now()}`,
        type: 'quote',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `Custom Order: ${form.width}×${form.height}, ${form.fabric}, ${form.style}, ${form.rodType}, ${form.pleatStyle}, ${form.layers} layer, Qty: ${form.quantity}, Room: ${form.room}. Notes: ${form.notes}`,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      toast.success('Custom order request submitted! We\'ll contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', width: '', height: '', fabric: '', style: '', rodType: '', layers: 'Single', pleatStyle: '', quantity: '1', notes: '', room: '' });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <SEOHead title="Custom Curtains — Made to Measure in Begusarai, Bihar | LuxDrape" description="Order custom curtains tailored to your windows. Choose from 200+ fabrics, styles & pleat types. Professional measurement & installation in Begusarai & Bihar." canonical="/custom-order" />
      {/* Hero */}
      <div className="relative h-[40vh] overflow-hidden">
        <img src={STOCK_IMAGES.fabric} alt="Custom curtain fabrics in Begusarai Bihar" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Bespoke Service</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Custom Curtain Order</h1>
            <p className="text-white/70 mt-3 max-w-xl mx-auto">Design your perfect curtains with our custom tailoring service. Choose fabric, size, style, and every detail.</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-stone-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Ruler, title: 'Custom Sizing', desc: 'Exact measurements for perfect fit' },
              { icon: Palette, title: '200+ Fabrics', desc: 'Premium materials to choose from' },
              { icon: Layers, title: 'Multiple Styles', desc: 'Every pleat and heading style available' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6 text-gold-700" />
                </div>
                <h3 className="font-semibold text-stone-900">{f.title}</h3>
                <p className="text-sm text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="font-heading text-2xl font-bold text-stone-900 mb-2">Design Your Curtains</h2>
          <p className="text-stone-500 mb-8">Fill in the details below and our team will provide a custom quote within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                Your Details
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <input type="text" required placeholder="Full Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                <input type="email" required placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
            </div>

            {/* Measurements */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                Measurements
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <input type="text" placeholder="Width (e.g., 60 inches)" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                <input type="text" placeholder="Height (e.g., 84 inches)" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                <select value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="">Select Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Office">Office</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                Specifications
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <select value={form.fabric} onChange={e => setForm({...form, fabric: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="">Select Fabric</option>
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={form.style} onChange={e => setForm({...form, style: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="">Select Curtain Style</option>
                  {CURTAIN_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={form.rodType} onChange={e => setForm({...form, rodType: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="">Select Rod Type</option>
                  {ROD_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={form.pleatStyle} onChange={e => setForm({...form, pleatStyle: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="">Select Pleat Style</option>
                  {PLEAT_STYLES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={form.layers} onChange={e => setForm({...form, layers: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                  <option value="Single">Single Layer</option>
                  <option value="Double">Double Layer (Sheer + Main)</option>
                  <option value="Triple">Triple Layer</option>
                </select>
                <input type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                Additional Notes
              </h3>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={4} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none" placeholder="Any specific requirements, color preferences, design inspiration..." />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gold-700 text-white font-semibold rounded-lg hover:bg-gold-800 transition-colors">
                <Send className="w-4 h-4" /> Submit Custom Order
              </button>
              <a
                href={`https://wa.me/${contactInfo.whatsappSales.replace(/[^0-9]/g, '')}?text=Hi! I'd like to discuss a custom curtain order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-semibold"
              >
                Or Discuss on WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
