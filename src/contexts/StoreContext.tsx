import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Testimonial, FAQ, Inquiry, ContactInfo } from '@/lib/types';
import { SAMPLE_PRODUCTS, SAMPLE_TESTIMONIALS, SAMPLE_FAQS, WHATSAPP_NUMBER, PHONE_NUMBER, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '@/lib/constants';

interface StoreContextType {
  products: Product[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  inquiries: Inquiry[];
  wishlist: string[];
  recentlyViewed: string[];
  contactInfo: ContactInfo;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  addFaq: (f: FAQ) => void;
  updateFaq: (id: string, updates: Partial<FAQ>) => void;
  deleteFaq: (id: string) => void;
  addInquiry: (i: Inquiry) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  toggleWishlist: (productId: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (cat: string) => Product[];
  getFeaturedProducts: () => Product[];
  getBestSellers: () => Product[];
  getNewArrivals: () => Product[];
  searchProducts: (query: string) => Product[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`luxdrape_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: any) {
  try {
    localStorage.setItem(`luxdrape_${key}`, JSON.stringify(data));
  } catch {}
}

const defaultContactInfo: ContactInfo = {
  phone: PHONE_NUMBER,
  whatsappSales: WHATSAPP_NUMBER,
  whatsappSupport: WHATSAPP_NUMBER,
  whatsappBulk: WHATSAPP_NUMBER,
  email: BUSINESS_EMAIL,
  address: BUSINESS_ADDRESS,
  businessHours: 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2!2d-73.987!3d40.757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzI1LjIiTiA3M8KwNTknMTMuMiJX!5e0!3m2!1sen!2sus!4v1234567890',
  socialMedia: {
    facebook: 'https://facebook.com/luxdrape',
    instagram: 'https://instagram.com/luxdrape',
    pinterest: 'https://pinterest.com/luxdrape',
    youtube: 'https://youtube.com/luxdrape',
  },
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', SAMPLE_PRODUCTS));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadFromStorage('testimonials', SAMPLE_TESTIMONIALS));
  const [faqs, setFaqs] = useState<FAQ[]>(() => loadFromStorage('faqs', SAMPLE_FAQS));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => loadFromStorage('inquiries', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadFromStorage('wishlist', []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => loadFromStorage('recentlyViewed', []));
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => loadFromStorage('contactInfo', defaultContactInfo));

  useEffect(() => { saveToStorage('products', products); }, [products]);
  useEffect(() => { saveToStorage('testimonials', testimonials); }, [testimonials]);
  useEffect(() => { saveToStorage('faqs', faqs); }, [faqs]);
  useEffect(() => { saveToStorage('inquiries', inquiries); }, [inquiries]);
  useEffect(() => { saveToStorage('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { saveToStorage('recentlyViewed', recentlyViewed); }, [recentlyViewed]);
  useEffect(() => { saveToStorage('contactInfo', contactInfo); }, [contactInfo]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, { ...product, createdAt: new Date().toISOString() }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addTestimonial = useCallback((t: Testimonial) => {
    setTestimonials(prev => [...prev, t]);
  }, []);

  const updateTestimonial = useCallback((id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTestimonial = useCallback((id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  }, []);

  const addFaq = useCallback((f: FAQ) => {
    setFaqs(prev => [...prev, f]);
  }, []);

  const updateFaq = useCallback((id: string, updates: Partial<FAQ>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const deleteFaq = useCallback((id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  }, []);

  const addInquiry = useCallback((i: Inquiry) => {
    setInquiries(prev => [i, ...prev]);
  }, []);

  const updateInquiryStatus = useCallback((id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  }, []);

  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setContactInfo(prev => ({ ...prev, ...info }));
  }, []);

  const getProductBySlug = useCallback((slug: string) => products.find(p => p.slug === slug), [products]);
  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const getProductsByCategory = useCallback((cat: string) => products.filter(p => p.category === cat), [products]);
  const getFeaturedProducts = useCallback(() => products.filter(p => p.featured), [products]);
  const getBestSellers = useCallback(() => products.filter(p => p.bestSeller), [products]);
  const getNewArrivals = useCallback(() => products.filter(p => p.newArrival), [products]);
  const searchProducts = useCallback((query: string) => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [products]);

  return (
    <StoreContext.Provider value={{
      products, testimonials, faqs, inquiries, wishlist, recentlyViewed, contactInfo,
      addProduct, updateProduct, deleteProduct,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addFaq, updateFaq, deleteFaq,
      addInquiry, updateInquiryStatus,
      toggleWishlist, addToRecentlyViewed, updateContactInfo,
      getProductBySlug, getProductById, getProductsByCategory,
      getFeaturedProducts, getBestSellers, getNewArrivals, searchProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
