import { Star } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export default function Reviews() {
  const { testimonials } = useStore();

  return (
    <div>
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Customer Love</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Reviews & Testimonials</h1>
          <p className="text-stone-400">Real experiences from our valued curtain customers.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Summary */}
        <div className="bg-white p-8 rounded-xl shadow-sm mb-12 text-center">
          <p className="text-5xl font-bold text-stone-900 mb-2">4.9</p>
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-stone-500">Based on {testimonials.length * 50}+ customer reviews</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
