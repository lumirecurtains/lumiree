import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';

export default function Wishlist() {
  const { wishlist, products } = useStore();
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div>
      <SEOHead title="My Wishlist | Curtavra" description="Your saved curtain favourites from Curtavra." canonical="/wishlist" noindex />
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">My Wishlist</h1>
          <p className="text-stone-400 mt-2">{wishedProducts.length} item{wishedProducts.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {wishedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-stone-500 mb-6">Save your favorite curtains to your wishlist for easy access later.</p>
            <Link to="/shop" className="inline-flex px-6 py-3 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors font-medium">
              Browse Curtains
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {wishedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
