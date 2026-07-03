import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export default function Footer() {
  const { contactInfo } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-gold-800 to-gold-900">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-white font-bold mb-3">Join Our Exclusive Collection</h3>
            <p className="text-gold-200 mb-6">Subscribe for first access to new curtain collections, exclusive deals, and interior design inspiration.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gold-600 text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="px-6 py-3 bg-white text-gold-800 font-semibold rounded-lg hover:bg-gold-50 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-sm flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">L</span>
              </div>
              <div>
                <h4 className="font-heading text-xl font-bold text-white leading-none">Lumivra</h4>
                <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase">Premium Curtains</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Begusarai's premier luxury curtain store. Transforming homes, offices, and hotels across Bihar with 
              handcrafted window treatments since 2010.
            </p>
            <div className="flex gap-3">
              <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center hover:bg-gold-700 transition-colors text-xs font-bold">
                FB
              </a>
              <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center hover:bg-gold-700 transition-colors text-xs font-bold">
                IG
              </a>
              <a href={contactInfo.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center hover:bg-gold-700 transition-colors text-xs font-bold">
                YT
              </a>
              <a href={contactInfo.socialMedia.pinterest} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center hover:bg-gold-700 transition-colors text-xs font-bold">
                P
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">Shop Curtains</h4>
            <ul className="space-y-2">
              {[
                { to: '/shop?category=blackout', label: 'Blackout Curtains' },
                { to: '/shop?category=sheer', label: 'Sheer Curtains' },
                { to: '/shop?category=luxury', label: 'Luxury Curtains' },
                { to: '/shop?category=bedroom', label: 'Bedroom Curtains' },
                { to: '/shop?category=living-room', label: 'Living Room Curtains' },
                { to: '/shop?category=modern', label: 'Modern Curtains' },
                { to: '/custom-order', label: 'Custom Curtains' },
                { to: '/shop', label: 'View All' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-stone-400 hover:text-gold-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/reviews', label: 'Customer Reviews' },
                { to: '/installation', label: 'Installation Service' },
                { to: '/quote-request', label: 'Request a Quote' },
                { to: '/faq', label: 'FAQ' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms & Conditions' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-stone-400 hover:text-gold-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <div>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm text-stone-400 hover:text-gold-400 transition-colors">{contactInfo.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-sm text-stone-400 hover:text-gold-400 transition-colors">{contactInfo.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-400">{contactInfo.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-400">{contactInfo.businessHours}</span>
              </li>
            </ul>
            <a
              href={`https://wa.me/${contactInfo.whatsappSales.replace(/[^0-9]/g, '')}?text=Hello! I'm interested in your luxury curtains.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">&copy; {new Date().getFullYear()} Lumivra, Begusarai, Bihar. Premium Luxury Curtains & Window Treatments.</p>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
