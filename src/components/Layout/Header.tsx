import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Menu, X, Phone, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopDropdown, setShopDropdown] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { wishlist, contactInfo } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const categories = [
    { slug: 'blackout', name: 'Blackout' },
    { slug: 'sheer', name: 'Sheer' },
    { slug: 'luxury', name: 'Luxury' },
    { slug: 'bedroom', name: 'Bedroom' },
    { slug: 'living-room', name: 'Living Room' },
    { slug: 'modern', name: 'Modern' },
    { slug: 'custom', name: 'Custom' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-stone-900 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1 hover:text-gold-400 transition-colors">
              <Phone className="w-3 h-3" /> {contactInfo.phone}
            </a>
            <span className="hidden sm:inline text-stone-400">|</span>
            <span className="hidden sm:inline text-stone-400">Free Shipping on Orders Over ₹5,000</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-stone-300">{user.displayName || user.email}</span>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1 text-gold-400 hover:text-gold-300">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </Link>
                )}
                <button onClick={() => signOut()} className="hover:text-gold-400 transition-colors">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-gold-400 transition-colors">Sign In / Register</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu btn */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -ml-2">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gold-600 to-gold-800 rounded-sm flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg md:text-xl">L</span>
              </div>
              <div>
                <h1 className="font-heading text-lg md:text-2xl font-bold text-stone-900 tracking-tight leading-none">LuxDrape</h1>
                <p className="text-[9px] md:text-[10px] text-stone-400 tracking-[0.2em] uppercase leading-none">Premium Curtains</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-stone-700 hover:text-gold-700 transition-colors">Home</Link>
              
              <div className="relative" onMouseEnter={() => setShopDropdown(true)} onMouseLeave={() => setShopDropdown(false)}>
                <Link to="/shop" className="text-sm font-medium text-stone-700 hover:text-gold-700 transition-colors flex items-center gap-1">
                  Shop <ChevronDown className="w-3 h-3" />
                </Link>
                {shopDropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-3 w-56 animate-slide-down border border-stone-100">
                    <Link to="/shop" className="block px-4 py-2 text-sm text-stone-700 hover:bg-gold-50 hover:text-gold-700">All Curtains</Link>
                    {categories.map(c => (
                      <Link key={c.slug} to={`/shop?category=${c.slug}`} className="block px-4 py-2 text-sm text-stone-700 hover:bg-gold-50 hover:text-gold-700">
                        {c.name} Curtains
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link to="/gallery" className="text-sm font-medium text-stone-700 hover:text-gold-700 transition-colors">Gallery</Link>
              <Link to="/custom-order" className="text-sm font-medium text-stone-700 hover:text-gold-700 transition-colors">Custom Order</Link>
              <Link to="/about" className="text-sm font-medium text-stone-700 hover:text-gold-700 transition-colors">About</Link>
              <Link to="/contact" className="text-sm font-medium text-stone-700 hover:text-gold-700 transition-colors">Contact</Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link to="/wishlist" className="p-2 hover:text-gold-700 transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to={user ? '/account' : '/login'} className="p-2 hover:text-gold-700 transition-colors hidden md:block">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-stone-100 py-4 px-4 animate-slide-down bg-white">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Search curtains by name, style, fabric, color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                autoFocus
              />
              <button type="submit" className="px-6 py-3 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors text-sm font-medium">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white animate-slide-down">
            <nav className="py-4 px-4 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop All Curtains' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/custom-order', label: 'Custom Order' },
                { to: '/installation', label: 'Installation Service' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/reviews', label: 'Reviews' },
                { to: '/faq', label: 'FAQ' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-stone-700 hover:bg-gold-50 hover:text-gold-700 rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-stone-100 pt-3 mt-3">
                {categories.map(c => (
                  <Link
                    key={c.slug}
                    to={`/shop?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 text-sm text-stone-500 hover:bg-gold-50 hover:text-gold-700 rounded-lg"
                  >
                    {c.name} Curtains
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
