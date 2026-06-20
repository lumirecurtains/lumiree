import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
      <div className="text-center">
        <p className="text-8xl mb-4">🪟</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-4">Page Not Found</h1>
        <p className="text-stone-500 text-lg mb-8 max-w-md mx-auto">
          The curtain you're looking for seems to have been drawn. Let us help you find your way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors font-medium">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/shop" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:border-gold-600 hover:text-gold-700 transition-colors font-medium">
            <ShoppingBag className="w-4 h-4" /> Browse Curtains
          </Link>
        </div>
      </div>
    </div>
  );
}
