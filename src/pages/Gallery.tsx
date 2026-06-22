import { useState } from 'react';
import { X } from 'lucide-react';
import { STOCK_IMAGES } from '@/lib/constants';
import SEOHead from '@/components/SEOHead';

export default function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const images = [
    { src: STOCK_IMAGES.hero, alt: 'Elegant traditional curtains in sunlit living room — LuxDrape Begusarai', category: 'Living Room' },
    { src: STOCK_IMAGES.bedroom, alt: 'Modern bedroom with sheer curtains installed in Bihar', category: 'Bedroom' },
    { src: STOCK_IMAGES.blackout, alt: 'Premium blackout velvet curtain — LuxDrape collection', category: 'Blackout' },
    { src: STOCK_IMAGES.luxury, alt: 'Luxury green curtains for living room in Begusarai', category: 'Luxury' },
    { src: STOCK_IMAGES.sheer, alt: 'White sheer curtains filtering natural light — Bihar homes', category: 'Sheer' },
    { src: STOCK_IMAGES.livingRoom, alt: 'Dining room beige curtains by LuxDrape', category: 'Living Room' },
    { src: STOCK_IMAGES.modern, alt: 'Modern bedroom curtains available in Begusarai', category: 'Modern' },
    { src: STOCK_IMAGES.drapes, alt: 'Gold and blue decorative luxury drapes', category: 'Luxury' },
    { src: STOCK_IMAGES.elegant, alt: 'Custom drapery installation by LuxDrape Bihar', category: 'Custom' },
    { src: STOCK_IMAGES.velvet, alt: 'Soft pink velvet curtain fabric close-up', category: 'Fabrics' },
    { src: STOCK_IMAGES.gold, alt: 'Golden hanging curtain for luxury interiors', category: 'Luxury' },
    { src: STOCK_IMAGES.minimal, alt: 'Minimalist bedroom curtains from LuxDrape', category: 'Minimal' },
    { src: STOCK_IMAGES.green, alt: 'Bedroom with green curtains — Begusarai home', category: 'Bedroom' },
    { src: STOCK_IMAGES.hotel, alt: 'Hotel curtain installation in Bihar', category: 'Hotel' },
    { src: STOCK_IMAGES.white, alt: 'White sheer curtains for bright bedrooms', category: 'Sheer' },
    { src: STOCK_IMAGES.dark, alt: 'Dark blackout curtain fabric by LuxDrape', category: 'Blackout' },
    { src: STOCK_IMAGES.office, alt: 'Office curtain panels for professional spaces in Bihar', category: 'Office' },
    { src: STOCK_IMAGES.vintage, alt: 'Custom vintage curtain design — LuxDrape Begusarai', category: 'Custom' },
  ];

  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(images.map(i => i.category)))];
  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter);

  return (
    <div>
      <SEOHead title="Curtain Gallery — Installation Photos | LuxDrape Begusarai" description="Browse stunning curtain installation photos from LuxDrape. Get inspired by luxury, sheer, blackout & custom curtain designs for homes and hotels in Bihar." canonical="/gallery" />
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Inspiration</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Curtain Gallery</h1>
          <p className="text-stone-400 max-w-2xl mx-auto">Browse our collection of stunning curtain installations and get inspired for your space.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === cat ? 'bg-gold-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <div key={i} className="break-inside-avoid group cursor-pointer" onClick={() => setLightbox(img.src)}>
              <div className="relative overflow-hidden rounded-xl">
                <img src={img.src} alt={img.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs uppercase tracking-wider">{img.category}</span>
                    <p className="text-sm font-medium">{img.alt}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white"><X className="w-8 h-8" /></button>
          <img src={lightbox} alt="Gallery image" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
