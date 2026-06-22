import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import SEOHead from '@/components/SEOHead';
import toast from 'react-hot-toast';

export default function Contact() {
  const { contactInfo, addInquiry } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addInquiry({
        id: `inq-${Date.now()}`,
        type: 'general',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `${form.subject}: ${form.message}`,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      toast.success('Message sent! We\'ll get back to you shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send message. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <SEOHead title="Contact LuxDrape — Curtain Shop in Begusarai, Bihar" description="Contact LuxDrape for curtain inquiries, custom orders, installation bookings. Visit our Begusarai showroom or reach us via WhatsApp. Serving all Bihar." canonical="/contact" />
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Get In Touch</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-stone-400 max-w-2xl mx-auto">Have questions about our curtains? Need help choosing the perfect fabric? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="space-y-6">
            {[
              { icon: Phone, title: 'Phone', info: contactInfo.phone, action: `tel:${contactInfo.phone}`, label: 'Call Us' },
              { icon: Mail, title: 'Email', info: contactInfo.email, action: `mailto:${contactInfo.email}`, label: 'Send Email' },
              { icon: MapPin, title: 'Address', info: contactInfo.address, action: '#map', label: 'View Map' },
              { icon: Clock, title: 'Business Hours', info: contactInfo.businessHours, action: null, label: null },
            ].map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-gold-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">{c.title}</h3>
                    <p className="text-sm text-stone-600">{c.info}</p>
                    {c.action && (
                      <a href={c.action} className="text-sm text-gold-700 hover:underline mt-1 inline-block">{c.label}</a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <a
              href={`https://wa.me/${contactInfo.whatsappSales.replace(/[^0-9]/g, '')}?text=Hello! I have a question about your curtains.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <h2 className="font-heading text-2xl font-bold text-stone-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" placeholder="Your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Subject *</label>
                    <select required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white">
                      <option value="">Select subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Custom Order">Custom Order</option>
                      <option value="Installation">Installation Service</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none" placeholder="Tell us about your curtain needs..." />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gold-700 text-white font-semibold rounded-lg hover:bg-gold-800 transition-colors w-full md:w-auto">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div id="map" className="mt-12 bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
          <div className="bg-stone-200 h-64 md:h-96 flex items-center justify-center text-stone-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gold-600" />
              <p className="font-heading font-semibold text-lg text-stone-900">LuxDrape Showroom — Begusarai</p>
              <p className="text-sm">{contactInfo.address}</p>
              <a href="https://maps.google.com/?q=Begusarai+Bihar+India" target="_blank" rel="noopener noreferrer" className="text-gold-700 hover:underline text-sm mt-2 inline-block">
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-12 bg-gold-50 rounded-xl p-6 md:p-8">
          <h3 className="font-heading text-xl font-bold text-stone-900 mb-3 text-center">We Deliver & Install Curtains Across Bihar</h3>
          <p className="text-stone-600 text-sm text-center mb-4">Visit our Begusarai showroom or order online with delivery to your doorstep.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Begusarai', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Bhagalpur', 'Gaya', 'Munger', 'Samastipur', 'Khagaria', 'All Bihar'].map(city => (
              <span key={city} className="px-3 py-1.5 bg-white text-stone-700 text-xs rounded-full border border-gold-200 font-medium">{city}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
