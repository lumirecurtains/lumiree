import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, Search, Star, X } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Product } from '@/lib/types';
import { CATEGORIES, MATERIALS, COLORS, STOCK_IMAGES } from '@/lib/constants';
import toast from 'react-hot-toast';
import { formatINR } from '@/utils/currency';

function generateDescription(name: string, category: string, material: string, color: string) {
  return {
    short: `Premium ${material.toLowerCase()} ${category.replace('-', ' ')} curtains in ${color.toLowerCase()}. Expertly crafted for elegance and durability.`,
    long: `Discover our ${name} — a stunning addition to our ${category.replace('-', ' ')} collection. Crafted from premium ${material.toLowerCase()} fabric, these curtains combine luxury with functionality. The rich ${color.toLowerCase()} tone adds sophistication to any room, while the expert construction ensures long-lasting beauty. Perfect for homeowners and designers who appreciate quality window treatments.`,
    seoTitle: `${name} | Premium ${category.replace('-', ' ')} Curtains | LuxDrape`,
    seoDesc: `Shop ${name} - premium ${material.toLowerCase()} ${category.replace('-', ' ')} curtains in ${color.toLowerCase()}. Free shipping on orders over ₹5,000. Expert installation available.`,
  };
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '', slug: '', shortDescription: '', description: '', price: 0, salePrice: null,
  category: '', material: '', colors: [], sizes: [], images: [STOCK_IMAGES.hero],
  tags: [], inStock: true, featured: false, bestSeller: false, newArrival: false,
  rating: 4.5, reviewCount: 0, careInstructions: '', installInfo: '', fabric: '',
  status: 'published',
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(emptyProduct);
  const [search, setSearch] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm({ ...emptyProduct });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (product: Product) => {
    setForm({ ...product });
    setEditing(product);
    setCreating(false);
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const autoGenerate = () => {
    if (form.name && form.category && form.material) {
      const color = form.colors?.[0] || 'neutral';
      const gen = generateDescription(form.name, form.category, form.material, color);
      setForm({ ...form, shortDescription: gen.short, description: gen.long });
      toast.success('Content auto-generated!');
    } else {
      toast.error('Fill in name, category, and material first');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) {
      toast.error('Name, category, and price are required');
      return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      if (editing) {
        await updateProduct(editing.id, { ...form, slug });
        toast.success('Product updated!');
      } else {
        await addProduct({ ...form, id: `prod-${Date.now()}`, slug });
        toast.success('Product created!');
      }
      closeForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product. Check console for details.');
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      await addProduct({
        ...product,
        id: `prod-${Date.now()}`,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${Date.now()}`,
      });
      toast.success('Product duplicated!');
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product.');
      }
    }
  };

  const addColor = () => { if (colorInput) { setForm({...form, colors: [...(form.colors || []), colorInput]}); setColorInput(''); }};
  const addSize = () => { if (sizeInput) { setForm({...form, sizes: [...(form.sizes || []), sizeInput]}); setSizeInput(''); }};
  const addTag = () => { if (tagInput) { setForm({...form, tags: [...(form.tags || []), tagInput]}); setTagInput(''); }};
  const addImage = () => { if (imageInput) { setForm({...form, images: [...(form.images || []), imageInput]}); setImageInput(''); }};

  if (editing || creating) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold text-stone-900">{editing ? 'Edit Product' : 'Add Product'}</h1>
          <button onClick={closeForm} className="text-stone-500 hover:text-stone-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm bg-white">
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Material *</label>
                <select value={form.material} onChange={e => setForm({...form, material: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm bg-white">
                  <option value="">Select</option>
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Pricing</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Sale Price (₹)</label>
                <input type="number" value={form.salePrice || ''} onChange={e => setForm({...form, salePrice: e.target.value ? Number(e.target.value) : null})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} className="rounded" />
                  In Stock
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-stone-900">Description</h3>
              <button onClick={autoGenerate} className="text-xs px-3 py-1 bg-gold-100 text-gold-700 rounded-full hover:bg-gold-200 font-medium">
                ✨ Auto Generate
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Short Description</label>
                <textarea value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} rows={2} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Fabric Details</label>
                <input type="text" value={form.fabric} onChange={e => setForm({...form, fabric: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm" />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Colors</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.colors || []).map((c: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded text-sm">
                  {c} <button onClick={() => setForm({...form, colors: form.colors.filter((_:any, idx:number) => idx !== i)})} className="text-stone-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={colorInput} onChange={e => setColorInput(e.target.value)} className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white">
                <option value="">Select color</option>
                {COLORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <button onClick={addColor} className="px-4 py-2 bg-stone-100 rounded-lg text-sm hover:bg-stone-200">Add</button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.sizes || []).map((s: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded text-sm">
                  {s} <button onClick={() => setForm({...form, sizes: form.sizes.filter((_:any, idx:number) => idx !== i)})} className="text-stone-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder='e.g., W52×L84"' className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm" />
              <button onClick={addSize} className="px-4 py-2 bg-stone-100 rounded-lg text-sm hover:bg-stone-200">Add</button>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Images (URLs)</h3>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {(form.images || []).map((img: string, i: number) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setForm({...form, images: form.images.filter((_:any, idx:number) => idx !== i)})} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="url" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="Paste image URL" className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm" />
              <button onClick={addImage} className="px-4 py-2 bg-stone-100 rounded-lg text-sm hover:bg-stone-200">Add</button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.tags || []).map((t: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gold-100 text-gold-700 rounded text-sm">
                  #{t} <button onClick={() => setForm({...form, tags: form.tags.filter((_:any, idx:number) => idx !== i)})} className="text-gold-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag" className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm" />
              <button onClick={addTag} className="px-4 py-2 bg-stone-100 rounded-lg text-sm hover:bg-stone-200">Add</button>
            </div>
          </div>

          {/* Flags */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Product Flags</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'featured', label: 'Featured' },
                { key: 'bestSeller', label: 'Best Seller' },
                { key: 'newArrival', label: 'New Arrival' },
              ].map(flag => (
                <label key={flag.key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form[flag.key]} onChange={e => setForm({...form, [flag.key]: e.target.checked})} className="rounded" />
                  {flag.label}
                </label>
              ))}
            </div>
          </div>

          {/* Care & Install */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Care Instructions</label>
              <textarea value={form.careInstructions} onChange={e => setForm({...form, careInstructions: e.target.value})} rows={2} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Installation Info</label>
              <textarea value={form.installInfo} onChange={e => setForm({...form, installInfo: e.target.value})} rows={2} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button onClick={handleSave} className="px-6 py-2.5 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors font-medium text-sm">
              {editing ? 'Update Product' : 'Create Product'}
            </button>
            <button onClick={closeForm} className="px-6 py-2.5 border border-stone-200 rounded-lg hover:bg-stone-50 text-sm">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {filtered.map(product => (
            <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors">
              <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-stone-900 truncate">{product.name}</h3>
                  {product.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <p className="text-xs text-stone-500 capitalize">{product.category.replace('-', ' ')} • {product.material}</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-stone-900">{formatINR(product.salePrice || product.price)}</p>
                {product.salePrice && <p className="text-xs text-stone-400 line-through">{formatINR(product.price)}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(product)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-blue-600" title="Edit"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDuplicate(product)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-green-600" title="Duplicate"><Copy className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
