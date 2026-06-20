import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const { contactInfo } = useStore();

  const cleanNumber = (num: string) => num.replace(/[^0-9]/g, '');

  const options = [
    { label: '🛒 Sales Inquiry', number: contactInfo.whatsappSales, msg: "Hi! I'm interested in purchasing curtains from LuxDrape." },
    { label: '🔧 Support', number: contactInfo.whatsappSupport, msg: "Hi! I need support with my LuxDrape order." },
    { label: '📦 Bulk Orders', number: contactInfo.whatsappBulk, msg: "Hi! I'd like to inquire about bulk curtain orders." },
    { label: '📐 Installation', number: contactInfo.whatsappSales, msg: "Hi! I'd like to book a curtain installation service." },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden w-72 animate-fade-in-up">
          <div className="bg-green-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold text-sm">LuxDrape on WhatsApp</h4>
                <p className="text-green-100 text-xs">Typically replies within minutes</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {options.map((opt, i) => (
              <a
                key={i}
                href={`https://wa.me/${cleanNumber(opt.number)}?text=${encodeURIComponent(opt.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2.5 bg-stone-50 hover:bg-green-50 rounded-lg text-sm text-stone-700 hover:text-green-700 transition-colors"
              >
                {opt.label}
              </a>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}
