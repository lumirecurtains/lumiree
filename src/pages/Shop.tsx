import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, Grid3X3, LayoutList } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { CATEGORIES, MATERIALS, COLORS } from '@/lib/constants';
import { formatINR } from '@/utils/currency';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { products } = useStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [gridView, setGridView] = useState(true);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedMaterial) result = result.filter(p => p.material === selectedMaterial);
    if (selectedColor) result = result.filter(p => p.colors.some(c => c.toLowerCase() === selectedColor.toLowerCase()));
    
    result = result.filter(p => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (searchParams.get('featured') === 'true') result = result.filter(p => p.featured);
    if (searchParams.get('bestseller') === 'true') result = result.filter(p => p.bestSeller);
    if (searchParams.get('new') === 'true') result = result.filter(p => p.newArrival);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case 'price-high': result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (a.newArrival ? 0 : 1) - (b.newArrival ? 0 : 1)); break;
      case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: result.sort((a, b) => (a.featured ? 0 : 1) - (b.featured ? 0 : 1));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedMaterial, selectedColor, sortBy, priceRange, searchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setSelectedColor('');
    setPriceRange([0, 100000]);
    setSortBy('featured');
  };

  const activeFilters = [selectedCategory, selectedMaterial, selectedColor].filter(Boolean).length + (searchQuery ? 1 : 0);

  const catName = selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Curtains' : 'All Curtains';

  return (
    <div className="bg-stone-50 min-h-screen">
      <SEOHead
        title={`Shop ${catName} Online in Begusarai, Bihar | LuxDrape`}
        description={`Browse premium ${catName.toLowerCase()} at LuxDrape. Blackout, sheer, velvet & custom options. Serving Begusarai, Patna & all Bihar. Free shipping over ₹5,000.`}
        canonical={`/shop${selectedCategory ? `?category=${selectedCategory}` : ''}`}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-2">Our Collection</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
            {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Shop Curtains' : 'Shop All Curtains'}
          </h1>
          <p className="text-stone-400">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-sm text-gold-700 hover:underline">Clear All</button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search curtains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 w-48 md:w-64"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="hidden md:flex items-center gap-1 border border-stone-200 rounded-lg p-0.5">
              <button onClick={() => setGridView(true)} className={`p-1.5 rounded ${gridView ? 'bg-stone-100' : ''}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setGridView(false)} className={`p-1.5 rounded ${!gridView ? 'bg-stone-100' : ''}`}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${filtersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between md:hidden">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              {/* Category */}
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-3">Category</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!selectedCategory ? 'bg-gold-50 text-gold-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === c.id ? 'bg-gold-50 text-gold-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-3">Material</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedMaterial('')}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!selectedMaterial ? 'bg-gold-50 text-gold-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    All Materials
                  </button>
                  {MATERIALS.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(m)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedMaterial === m ? 'bg-gold-50 text-gold-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">{formatINR(priceRange[0])}</span>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 accent-gold-600"
                  />
                  <span className="text-sm text-stone-500">{formatINR(priceRange[1])}</span>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {COLORS.slice(0, 12).map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-gold-600 scale-110' : 'border-stone-200'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-4xl mb-4">🪟</p>
                <h3 className="font-heading text-xl font-semibold text-stone-900 mb-2">No Curtains Found</h3>
                <p className="text-stone-500 mb-4">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={gridView ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                {filtered.map(p => (
                  gridView ? (
                    <ProductCard key={p.id} product={p} />
                  ) : (
                    <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
                      <img src={p.images[0]} alt={p.name} className="w-32 md:w-48 h-auto object-cover" loading="lazy" />
                      <div className="p-4 flex-1">
                        <p className="text-xs text-gold-600 uppercase tracking-wider mb-1">{p.category.replace('-', ' ')} • {p.material}</p>
                        <h3 className="font-heading font-semibold text-stone-900 mb-1">{p.name}</h3>
                        <p className="text-sm text-stone-500 line-clamp-2 mb-2">{p.shortDescription}</p>
                        <div className="flex items-center gap-2">
                          {p.salePrice ? (
                            <><span className="text-lg font-bold text-stone-900">{formatINR(p.salePrice)}</span><span className="text-sm text-stone-400 line-through">{formatINR(p.price)}</span></>
                          ) : (
                            <span className="text-lg font-bold text-stone-900">{formatINR(p.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
