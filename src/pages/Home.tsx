import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Shield, Award, Ruler, Phone, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/ProductCard';
import { STOCK_IMAGES, CATEGORIES } from '@/lib/constants';
import { formatINR } from '@/utils/currency';

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      image: STOCK_IMAGES.hero,
      title: 'Luxury Curtains for\nDistinguished Spaces',
      subtitle: 'Discover our handcrafted collection of premium window treatments',
      cta: 'Explore Collection',
      link: '/shop',
    },
    {
      image: STOCK_IMAGES.hero2,
      title: 'Transform Your\nBedroom Sanctuary',
      subtitle: 'Premium blackout & sheer curtains for the perfect ambiance',
      cta: 'Shop Bedroom',
      link: '/shop?category=bedroom',
    },
    {
      image: STOCK_IMAGES.hero3,
      title: 'Custom Tailored\nTo Perfection',
      subtitle: 'Made-to-measure curtains crafted by expert artisans',
      cta: 'Order Custom',
      link: '/custom-order',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt="Luxury curtain display" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in">Premium Collection</p>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={slides[current].link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-600 hover:bg-gold-700 text-white font-semibold rounded-lg transition-colors"
              >
                {slides[current].cta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/quote-request"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-colors"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-gold-500' : 'w-4 bg-white/40'}`}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent((current + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: Truck, title: 'Free Shipping', desc: `On orders over ${formatINR(5000)}` },
    { icon: Shield, title: 'Quality Guarantee', desc: '30-day satisfaction' },
    { icon: Award, title: 'Premium Fabrics', desc: 'Handpicked materials' },
    { icon: Ruler, title: 'Custom Sizing', desc: 'Made to measure' },
    { icon: Phone, title: 'Expert Support', desc: 'WhatsApp & phone' },
  ];

  return (
    <section className="bg-stone-50 border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-gold-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{b.title}</p>
                <p className="text-xs text-stone-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categoryImages: Record<string, string> = {
    blackout: STOCK_IMAGES.blackout,
    sheer: STOCK_IMAGES.sheer,
    luxury: STOCK_IMAGES.luxury,
    bedroom: STOCK_IMAGES.bedroom,
    'living-room': STOCK_IMAGES.livingRoom,
    office: STOCK_IMAGES.office,
    hotel: STOCK_IMAGES.hotel,
    modern: STOCK_IMAGES.modern,
    minimal: STOCK_IMAGES.minimal,
    printed: STOCK_IMAGES.green,
    custom: STOCK_IMAGES.fabric,
  };

  const featured = CATEGORIES.filter(c => ['blackout', 'sheer', 'luxury', 'bedroom', 'living-room', 'custom'].includes(c.id));

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Our Collections</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-3">Curtain Categories</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Explore our carefully curated collections, from light-filtering sheers to premium blackout curtains.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden"
            >
              <img
                src={categoryImages[cat.id] || STOCK_IMAGES.hero}
                alt={`${cat.name} collection`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-white/70 text-xs md:text-sm mb-3">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Shop Now <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { getFeaturedProducts } = useStore();
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Handpicked</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900">Featured Curtains</h2>
          </div>
          <Link to="/shop?featured=true" className="hidden md:inline-flex items-center gap-1 text-gold-700 font-medium hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link to="/shop?featured=true" className="inline-flex items-center gap-1 text-gold-700 font-medium">
            View All Featured <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  const { getBestSellers } = useStore();
  const best = getBestSellers().slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Most Popular</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900">Best Selling Curtains</h2>
          </div>
          <Link to="/shop?bestseller=true" className="hidden md:inline-flex items-center gap-1 text-gold-700 font-medium hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {best.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const { getNewArrivals } = useStore();
  const arrivals = getNewArrivals().slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Just Arrived</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900">New Arrivals</h2>
          </div>
          <Link to="/shop?new=true" className="hidden md:inline-flex items-center gap-1 text-gold-700 font-medium hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {arrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { testimonials } = useStore();
  const featured = testimonials.filter(t => t.featured).slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-stone-400 max-w-2xl mx-auto">Real experiences from our valued customers who transformed their spaces with LuxDrape curtains.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(t => (
            <div key={t.id} className="bg-stone-800/50 rounded-xl p-6 md:p-8 backdrop-blur">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-600'}`} />
                ))}
              </div>
              <p className="text-stone-300 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/reviews" className="inline-flex items-center gap-2 px-6 py-3 border border-gold-600 text-gold-400 hover:bg-gold-600 hover:text-white rounded-lg transition-colors font-medium">
            Read All Reviews <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  const items = [
    { before: STOCK_IMAGES.white, after: STOCK_IMAGES.bedroom, room: 'Master Bedroom' },
    { before: STOCK_IMAGES.office, after: STOCK_IMAGES.livingRoom, room: 'Living Room' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Transformations</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-3">Before & After</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">See how our curtains completely transform living spaces.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img src={item.before} alt="Before curtain installation" className="w-full h-48 md:h-64 object-cover" loading="lazy" />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Before</span>
                </div>
                <div className="relative">
                  <img src={item.after} alt="After curtain installation" className="w-full h-48 md:h-64 object-cover" loading="lazy" />
                  <span className="absolute bottom-2 left-2 bg-gold-600 text-white text-xs px-2 py-1 rounded">After</span>
                </div>
              </div>
              <div className="bg-stone-50 p-4 text-center">
                <h4 className="font-heading font-semibold text-stone-900">{item.room} Transformation</h4>
                <p className="text-sm text-stone-500">LuxDrape curtain installation</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstallationShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-stone-100 to-gold-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Professional Service</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-4">Expert Curtain Installation</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Our team of professional installers ensures your curtains are hung perfectly. From measuring to final styling, 
              we handle every detail so you can enjoy beautiful windows without the hassle.
            </p>
            <ul className="space-y-3 mb-8">
              {['Free professional measurement', 'Expert rod & track installation', 'Perfect curtain hanging & styling', 'Clean-up & old curtain removal'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-stone-700">
                  <span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/installation" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors font-medium">
              Book Installation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <img src={STOCK_IMAGES.elegant} alt="Professional curtain installation" className="rounded-xl shadow-xl w-full" loading="lazy" />
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">500+ Installations</p>
                  <p className="text-xs text-stone-500">Completed this year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQPreview() {
  const { faqs } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-2">Common Questions</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-3">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.slice(0, 5).map(faq => (
            <div key={faq.id} className="border border-stone-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-medium text-stone-900 pr-4">{faq.question}</span>
                <ChevronRight className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${openId === faq.id ? 'rotate-90' : ''}`} />
              </button>
              {openId === faq.id && (
                <div className="px-5 pb-4 text-stone-600 text-sm leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/faq" className="inline-flex items-center gap-1 text-gold-700 font-medium hover:gap-2 transition-all">
            View All FAQs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatsAppCTA() {
  const { contactInfo } = useStore();
  const cleanNumber = (num: string) => num.replace(/[^0-9]/g, '');
  
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-green-700">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Need Help Choosing?</h2>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
          Our curtain experts are just a WhatsApp message away. Get personalized recommendations, custom quotes, and installation advice.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/${cleanNumber(contactInfo.whatsappSales)}?text=Hi! I need help choosing the right curtains for my home.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
          <a href={`tel:${contactInfo.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
            <Phone className="w-5 h-5" /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TrustBadges />
      <CategoriesSection />
      <FeaturedProducts />
      <BestSellers />
      <BeforeAfter />
      <NewArrivals />
      <Testimonials />
      <InstallationShowcase />
      <FAQPreview />
      <WhatsAppCTA />
    </div>
  );
}
