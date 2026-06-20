import { Image } from 'lucide-react';
import { STOCK_IMAGES } from '@/lib/constants';

export default function AdminGallery() {
  const images = Object.entries(STOCK_IMAGES);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-900">Gallery Management</h1>
        <p className="text-stone-500 text-sm">Manage gallery images and before/after photos</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="bg-stone-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-stone-600">
            <strong>Tip:</strong> To upload images, connect Firebase Storage by setting environment variables. 
            Currently using stock imagery from Pexels.
          </p>
        </div>

        <h3 className="font-semibold text-stone-900 mb-4">Current Gallery Images ({images.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map(([key, url]) => (
            <div key={key} className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100">
              <img src={url} alt={key} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <span className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
