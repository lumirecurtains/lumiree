import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, Share2, Truck, Shield, RotateCcw, ChevronRight, ZoomIn, X, Minus, Plus } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { formatINR } from '@/utils/currency';

export default function ProductDetail() {
  const { slug } = useParams();
  const { getProductBySlug, wishlist, toggleWishlist, addToRecentlyViewed, recentlyViewed, products, contactInfo } = useStore();
  const product = getProductBySlug(slug || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [tab, setTab] = useState<'description' | 'care' | 'install'>('description');

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(product.sizes[0] || '');
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-6xl mb-4">🪟</p>
          <h2 className="font-heading text-2xl font-bold text-stone-900 mb-2">Product Not Found</h2>
          <Link to="/shop" className="text-gold-700 hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const recentProducts = recentlyViewed
    .filter(id => id !== product.id)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4) as typeof products;

  const whatsappMsg = `Hi! I'm interested in "${product.name}" (${selectedColor}, ${selectedSize}). Price: ${formatINR(product.salePrice || product.price)}. Can you help me?`;

  const productSchema = useMemo<Record<string, unknown> | undefined>(() => {
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": product.name,
          "description": product.shortDescription,
          "image": product.images,
          "brand": { "@type": "Brand", "name": "LuxDrape" },
          "category": product.category.replace('-', ' '),
          "material": product.material,
          "offers": {
            "@type": "Offer",
            "url": `https://lumiree.vercel.app/product/${product.slug}`,
            "priceCurrency": "INR",
            "price": product.salePrice || product.price,
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": { "@type": "Organization", "name": "LuxDrape" },
            "areaServed": { "@type": "State", "name": "Bihar" }
          },
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lumiree.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://lumiree.vercel.app/shop" },
            { "@type": "ListItem", "position": 3, "name": product.category.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()), "item": `https://lumiree.vercel.app/shop?category=${product.category}` },
            { "@type": "ListItem", "position": 4, "name": product.name },
          ]
        }
      ]
    };
    if (product.reviewCount > 0) {
      const graph = schema["@graph"] as Array<Record<string, unknown>>;
      const productNode = graph[0] as Record<string, unknown>;
      productNode.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviewCount.toString()
      };
    }
    return schema;
  }, [product]);

  return (
    <div className="bg-stone-50">
      <SEOHead
        title={`${product.name} | Buy Online in Begusarai, Bihar | LuxDrape`}
        description={`${product.shortDescription} Available in ${product.colors.join(', ')}. ${product.material} fabric. Buy online with free shipping across Bihar.`}
        canonical={`/product/${product.slug}`}
        ogImage={product.images[0]}
        type="product"
        jsonLd={productSchema}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link to="/" className="hover:text-gold-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-gold-700">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-gold-700 capitalize">{product.category.replace('-', ' ')}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-[4/5] bg-white rounded-xl overflow-hidden mb-3 group cursor-pointer" onClick={() => setZoomOpen(true)}>
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" width={1200} height={1500} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{discount}%</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-gold-600' : 'border-transparent'}`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" loading="lazy" width={200} height={200} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.newArrival && <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">NEW</span>}
              {product.bestSeller && <span className="px-2.5 py-0.5 bg-gold-100 text-gold-700 text-xs font-bold rounded-full">BEST SELLER</span>}
            </div>

            <p className="text-sm text-gold-600 uppercase tracking-wider mb-1">{product.category.replace('-', ' ')} • {product.material}</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-stone-900 mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                ))}
              </div>
              <span className="text-sm text-stone-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-stone-900">{formatINR(product.salePrice)}</span>
                  <span className="text-xl text-stone-400 line-through">{formatINR(product.price)}</span>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Save {formatINR(product.price - product.salePrice)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-stone-900">{formatINR(product.price)}</span>
              )}
            </div>

            <p className="text-stone-600 leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Color */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-stone-900 mb-2">Color: <span className="font-normal text-stone-600">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors ${selectedColor === color ? 'border-gold-600 bg-gold-50 text-gold-800' : 'border-stone-200 hover:border-stone-300'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-stone-900 mb-2">Size: <span className="font-normal text-stone-600">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors ${selectedSize === size ? 'border-gold-600 bg-gold-50 text-gold-800' : 'border-stone-200 hover:border-stone-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-stone-900 mb-2">Quantity</p>
              <div className="inline-flex items-center border border-stone-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-stone-50">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-stone-50">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={`https://wa.me/${contactInfo.whatsappSales.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order via WhatsApp
              </a>
              <button onClick={() => toggleWishlist(product.id)} className={`flex items-center justify-center gap-2 px-6 py-3.5 border-2 rounded-lg font-semibold transition-colors ${isWished ? 'border-red-500 text-red-500 bg-red-50' : 'border-stone-200 hover:border-gold-600 hover:text-gold-700'}`}>
                <Heart className="w-5 h-5" fill={isWished ? 'currentColor' : 'none'} /> {isWished ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-stone-200 rounded-lg hover:border-gold-600 hover:text-gold-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto text-gold-700 mb-1" />
                <p className="text-xs font-medium text-stone-900">Free Shipping</p>
                <p className="text-[10px] text-stone-500">Orders ₹5,000+</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto text-gold-700 mb-1" />
                <p className="text-xs font-medium text-stone-900">Quality Guarantee</p>
                <p className="text-[10px] text-stone-500">30-Day Returns</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-5 h-5 mx-auto text-gold-700 mb-1" />
                <p className="text-xs font-medium text-stone-900">Easy Exchange</p>
                <p className="text-[10px] text-stone-500">Hassle-free</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex border-b border-stone-200">
                {[
                  { key: 'description' as const, label: 'Description' },
                  { key: 'care' as const, label: 'Care Instructions' },
                  { key: 'install' as const, label: 'Installation' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-gold-600 text-gold-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="py-4 text-sm text-stone-600 leading-relaxed">
                {tab === 'description' && (
                  <div>
                    <p className="mb-4">{product.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-stone-50 p-3 rounded-lg">
                        <p className="text-xs text-stone-400 mb-1">Fabric</p>
                        <p className="text-sm font-medium text-stone-900">{product.fabric}</p>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-lg">
                        <p className="text-xs text-stone-400 mb-1">Material</p>
                        <p className="text-sm font-medium text-stone-900">{product.material}</p>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-lg">
                        <p className="text-xs text-stone-400 mb-1">Stock</p>
                        <p className="text-sm font-medium text-stone-900">{product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-lg">
                        <p className="text-xs text-stone-400 mb-1">Category</p>
                        <p className="text-sm font-medium text-stone-900 capitalize">{product.category.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {tab === 'care' && <p>{product.careInstructions}</p>}
                {tab === 'install' && <p>{product.installInfo}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-6">Related Curtains</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 text-white"><X className="w-8 h-8" /></button>
          <img src={product.images[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" width={1200} height={1500} />
        </div>
      )}
    </div>
  );
}
