import { Link } from 'react-router-dom';
import { Heart, Star, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/contexts/StoreContext';
import { formatINR } from '@/utils/currency';

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: Props) {
  const { wishlist, toggleWishlist } = useStore();
  const isWished = wishlist.includes(product.id);
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <div className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={`${product.name} - Premium Curtain`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">New</span>
          )}
          {product.bestSeller && (
            <span className="px-2.5 py-1 bg-gold-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">Best Seller</span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">-{discount}%</span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isWished ? 'bg-red-500 text-white' : 'bg-white text-stone-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className="w-4 h-4" fill={isWished ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gold-50 hover:text-gold-700 transition-colors text-stone-600"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick View */}
        <Link
          to={`/product/${product.slug}`}
          className="absolute bottom-0 left-0 right-0 bg-stone-900/90 text-white text-center py-3 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          View Details
        </Link>
      </div>

      <div className="p-4">
        <p className="text-xs text-gold-600 uppercase tracking-wider font-medium mb-1">
          {product.category.replace('-', ' ')} • {product.material}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading text-base font-semibold text-stone-900 hover:text-gold-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
          ))}
          <span className="text-xs text-stone-400 ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-stone-900">{formatINR(product.salePrice)}</span>
              <span className="text-sm text-stone-400 line-through">{formatINR(product.price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-stone-900">{formatINR(product.price)}</span>
          )}
        </div>

        <div className="flex gap-1 mt-3">
          {product.colors.slice(0, 4).map(color => (
            <span key={color} className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">{color}</span>
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}
