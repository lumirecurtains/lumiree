import { Link } from 'react-router-dom';
import { Award, Users, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { STOCK_IMAGES } from '@/lib/constants';
import SEOHead from '@/components/SEOHead';

export default function About() {
  return (
    <div>
      <SEOHead title="About LuxDrape — Premium Curtain Store in Begusarai, Bihar" description="LuxDrape is Begusarai's premier curtain store. 15+ years of excellence crafting luxury curtains with 200+ fabrics. Serving Bihar with expert installation." canonical="/about" />
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={STOCK_IMAGES.elegant} alt="LuxDrape curtain showroom in Begusarai Bihar" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Our Story</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">About LuxDrape</h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Since 2010 • Begusarai, Bihar</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-6">Crafting Elegance for Every Window in Bihar</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Founded in Begusarai, LuxDrape was built with a singular vision: to bring world-class curtain craftsmanship to 
                homes and businesses across Bihar. We believe the right curtains don't just dress a window — they define a 
                room's character, mood, and personality.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                What started as a small atelier in Begusarai has grown into Bihar's most trusted curtain brand. Today, we 
                serve thousands of homes, hotels, and offices across Begusarai, Patna, Muzaffarpur, Darbhanga, Bhagalpur, 
                Gaya, and every corner of Bihar with our premium curtain collections.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Every curtain we create undergoes rigorous quality checks, from fabric selection to stitching perfection. 
                We source our materials from the finest textile mills, ensuring that each piece delivers on our promise of 
                luxury, durability, and timeless elegance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={STOCK_IMAGES.velvet} alt="Premium velvet curtain fabric available in Begusarai" className="rounded-xl w-full h-48 md:h-64 object-cover" loading="lazy" />
              <img src={STOCK_IMAGES.sheer} alt="Sheer curtain detail from LuxDrape Bihar" className="rounded-xl w-full h-48 md:h-64 object-cover mt-8" loading="lazy" />
              <img src={STOCK_IMAGES.bedroom} alt="Bedroom curtain installation in Bihar" className="rounded-xl w-full h-48 md:h-64 object-cover" loading="lazy" />
              <img src={STOCK_IMAGES.luxury} alt="Luxury curtain collection at LuxDrape Begusarai" className="rounded-xl w-full h-48 md:h-64 object-cover mt-8" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, num: '15+', label: 'Years of Excellence' },
              { icon: Users, num: '10,000+', label: 'Happy Customers' },
              { icon: Layers, num: '200+', label: 'Premium Fabrics' },
              { icon: Sparkles, num: '50,000+', label: 'Curtains Crafted' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{s.num}</p>
                <p className="text-sm text-stone-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-3">Our Promise</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">What sets LuxDrape apart in the world of window treatments.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Premium Fabrics', desc: 'We source only the finest fabrics from renowned textile mills worldwide — velvet, silk, linen, and more.' },
              { title: 'Expert Craftsmanship', desc: 'Every curtain is meticulously crafted by skilled artisans with decades of experience in textile artistry.' },
              { title: 'Custom Tailoring', desc: 'From exact measurements to personalized fabric selection, we create curtains that fit your space perfectly.' },
            ].map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gold-700 font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-stone-900 mb-2">{v.title}</h3>
                <p className="text-stone-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-gold-700 to-gold-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-gold-100 text-lg mb-8">Discover our complete collection of premium curtains and window treatments.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gold-800 font-bold rounded-lg hover:bg-gold-50 transition-colors">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
