import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import SEOHead from '@/components/SEOHead';

export default function FAQ() {
  const { faqs, contactInfo } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  return (
    <div>
      <SEOHead title="FAQ — Curtain Questions Answered | Lumivra Begusarai" description="Find answers about curtain types, custom orders, measurements, installation, delivery, pricing, care & returns. Lumivra — Begusarai's curtain experts." canonical="/faq" jsonLd={faqSchema} />
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Help Center</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-stone-400 max-w-2xl mx-auto">Find answers to common questions about our curtains, custom orders, installation, and more.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-stone-900 pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-5 text-stone-600 leading-relaxed animate-fade-in border-t border-stone-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gold-50 rounded-xl p-8 text-center">
          <h3 className="font-heading text-xl font-bold text-stone-900 mb-2">Still have questions?</h3>
          <p className="text-stone-600 mb-4">Our curtain experts are here to help you make the perfect choice.</p>
          <a
            href={`https://wa.me/${contactInfo.whatsappSupport.replace(/[^0-9]/g, '')}?text=Hi! I have a question that's not in the FAQ.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <MessageCircle className="w-5 h-5" /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
