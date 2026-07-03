import SEOHead from '@/components/SEOHead';

export default function Terms() {
  return (
    <div>
      <SEOHead title="Terms & Conditions | Lumivra" description="Lumivra terms and conditions for curtain purchases, custom orders, shipping, returns, installation services and warranty." canonical="/terms" noindex />
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">Terms & Conditions</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-stone-600 leading-relaxed mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        {[
          { title: '1. General Terms', content: 'By accessing Lumivra, you agree to these terms and conditions. Our website offers premium curtains, custom window treatments, and professional installation services.' },
          { title: '2. Products & Pricing', content: 'All curtain prices are listed in Indian Rupees (INR) and are subject to change. Custom-made curtains are priced based on fabric, size, and specifications. A deposit may be required for custom orders.' },
          { title: '3. Custom Orders', content: 'Custom curtain orders are made to your specific measurements and specifications. Once production begins, custom orders cannot be cancelled or returned. We will send fabric swatches for approval before production.' },
          { title: '4. Shipping & Delivery', content: 'Standard curtains ship within 3-5 business days. Custom orders take 2-4 weeks. Free shipping on orders over ₹5,000. Installation service appointments are subject to availability.' },
          { title: '5. Returns & Exchanges', content: 'Standard curtains may be returned within 30 days in original condition. Custom-made curtains are non-refundable. Exchanges are available for standard products with different sizes or colors.' },
          { title: '6. Installation Service', content: 'Our professional installation service includes measurement, rod/track installation, and curtain hanging. Installation pricing varies based on scope. Cancellations must be made 24 hours before the scheduled appointment.' },
          { title: '7. Warranty', content: 'All curtains come with a 1-year warranty against manufacturing defects. This does not cover normal wear, improper care, or damage from sunlight exposure.' },
        ].map((section, i) => (
          <div key={i} className="mb-6">
            <h2 className="font-heading text-xl font-bold text-stone-900 mb-2">{section.title}</h2>
            <p className="text-stone-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
