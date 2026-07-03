import { useState, type FormEvent } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import SEOHead from '@/components/SEOHead';
import toast from 'react-hot-toast';

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star className={`w-7 h-7 transition-colors cursor-pointer ${n <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-stone-200 hover:text-amber-200'}`} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { getApprovedReviews, getAverageRating, addReview, products } = useStore();
  const approved = getApprovedReviews();
  const { avg, count } = getAverageRating();

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    userName: '', userEmail: '', rating: 0, title: '', text: '', productId: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.userName.trim()) { toast.error('Please enter your name.'); return; }
    if (form.rating === 0) { toast.error('Please select a rating.'); return; }
    if (!form.text.trim()) { toast.error('Please write your review.'); return; }
    if (form.text.trim().length < 10) { toast.error('Review must be at least 10 characters.'); return; }

    setSubmitting(true);
    try {
      const selectedProduct = form.productId ? products.find(p => p.id === form.productId) : null;
      await addReview({
        id: '',
        userName: form.userName.trim(),
        userEmail: form.userEmail.trim(),
        rating: form.rating,
        title: form.title.trim(),
        text: form.text.trim(),
        productId: form.productId || '',
        productName: selectedProduct ? selectedProduct.name : '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setForm({ userName: '', userEmail: '', rating: 0, title: '', text: '', productId: '' });
    } catch (error: unknown) {
      console.error('Error submitting review:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit review. Please try again.';
      toast.error(message);
    }
    setSubmitting(false);
  };

  // Distribution of ratings
  const distribution = [5,4,3,2,1].map(star => {
    const c = approved.filter(r => r.rating === star).length;
    return { star, count: c, pct: count > 0 ? Math.round((c / count) * 100) : 0 };
  });

  const reviewSchema: Record<string, unknown> | undefined = count > 0 ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Lumivra",
    "description": "Premium Luxury Curtains & Window Treatments in Begusarai, Bihar",
    "address": { "@type": "PostalAddress", "addressLocality": "Begusarai", "addressRegion": "Bihar", "addressCountry": "IN" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avg.toString(),
      "reviewCount": count.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": approved.slice(0, 10).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.userName },
      "datePublished": r.createdAt.split('T')[0],
      "reviewRating": { "@type": "Rating", "ratingValue": r.rating.toString(), "bestRating": "5" },
      "name": r.title || 'Customer Review',
      "reviewBody": r.text,
    })),
  } : undefined;

  return (
    <div>
      <SEOHead
        title={`Customer Reviews${count > 0 ? ` — ${avg}★ Rating` : ''} | Lumivra Begusarai`}
        description={`Read ${count > 0 ? count : ''} genuine customer reviews of Lumivra curtains. ${count > 0 ? `Rated ${avg}/5 stars.` : ''} Premium curtain store in Begusarai, Bihar.`}
        canonical="/reviews"
        jsonLd={reviewSchema}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Customer Love</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Reviews & Ratings</h1>
          <p className="text-stone-400">Genuine experiences from our valued curtain customers.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Rating Summary */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-6xl font-bold text-stone-900 mb-1">{count > 0 ? avg : '—'}</p>
              <div className="flex gap-1 justify-center md:justify-start mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(avg) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                ))}
              </div>
              <p className="text-stone-500 text-sm">{count > 0 ? `Based on ${count} verified review${count !== 1 ? 's' : ''}` : 'No reviews yet. Be the first!'}</p>
            </div>
            <div className="space-y-2">
              {distribution.map(d => (
                <div key={d.star} className="flex items-center gap-3">
                  <span className="text-sm text-stone-600 w-12 flex items-center gap-1">{d.star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" /></span>
                  <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-xs text-stone-400 w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Write Review CTA / Form */}
        <div className="mb-10">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-1">Thank You!</h3>
              <p className="text-stone-600 text-sm">Your review has been submitted and is awaiting admin approval. It will appear on the website once approved.</p>
              <button onClick={() => { setSubmitted(false); setShowForm(false); }} className="mt-4 text-sm text-gold-700 hover:underline">Submit Another Review</button>
            </div>
          ) : !showForm ? (
            <div className="text-center">
              <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors font-medium">
                <Star className="w-4 h-4" /> Write a Review
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 md:p-8 animate-fade-in">
              <h3 className="font-heading text-xl font-bold text-stone-900 mb-1">Share Your Experience</h3>
              <p className="text-stone-500 text-sm mb-6">Your review will be published after admin approval.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Your Rating *</label>
                  <StarRatingInput value={form.rating} onChange={(v) => setForm({...form, rating: v})} />
                </div>

                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Your Name *</label>
                    <input type="text" required value={form.userName} onChange={e => setForm({...form, userName: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email (optional, not shown publicly)</label>
                    <input type="email" value={form.userEmail} onChange={e => setForm({...form, userEmail: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" placeholder="you@example.com" />
                  </div>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Product (optional)</label>
                  <select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm bg-white">
                    <option value="">General review / No specific product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Review Title</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" placeholder="Summarize your experience" />
                </div>

                {/* Text */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Review *</label>
                  <textarea required value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={4} className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none" placeholder="Share details about your experience with our curtains, quality, installation, service..." minLength={10} />
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors font-medium text-sm disabled:opacity-50">
                    <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-stone-200 rounded-lg text-sm hover:bg-stone-50">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Approved Reviews */}
        {approved.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                  ))}
                </div>
                {r.title && <h4 className="font-semibold text-stone-900 text-sm mb-1">{r.title}</h4>}
                <p className="text-stone-600 leading-relaxed mb-4 text-sm italic">"{r.text}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{r.userName}</p>
                    {r.productName && <p className="text-xs text-gold-600">{r.productName}</p>}
                  </div>
                  <p className="text-xs text-stone-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-stone-200 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-semibold text-stone-900 mb-1">No Reviews Yet</h3>
            <p className="text-stone-500 text-sm">Be the first to share your experience with Lumivra curtains!</p>
          </div>
        )}
      </div>
    </div>
  );
}
