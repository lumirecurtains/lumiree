import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Product, Testimonial, FAQ, Inquiry, ContactInfo, Review } from '@/lib/types';
import { SAMPLE_PRODUCTS, SAMPLE_TESTIMONIALS, SAMPLE_FAQS, WHATSAPP_NUMBER, PHONE_NUMBER, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '@/lib/constants';

interface StoreContextType {
  products: Product[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  inquiries: Inquiry[];
  reviews: Review[];
  wishlist: string[];
  recentlyViewed: string[];
  contactInfo: ContactInfo;
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addTestimonial: (t: Testimonial) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addFaq: (f: FAQ) => Promise<void>;
  updateFaq: (id: string, updates: Partial<FAQ>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  addInquiry: (i: Inquiry) => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  addReview: (r: Review) => Promise<void>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  getApprovedReviews: () => Review[];
  getReviewsByProduct: (productId: string) => Review[];
  getAverageRating: () => { avg: number; count: number };
  toggleWishlist: (productId: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  updateContactInfo: (info: Partial<ContactInfo>) => Promise<void>;
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

// Local storage helpers for user-specific data (wishlist, recently viewed)
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`curtavra_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(`curtavra_${key}`, JSON.stringify(data));
  } catch {
    // localStorage unavailable (private mode/quota) — safe to ignore
  }
}

const defaultContactInfo: ContactInfo = {
  phone: PHONE_NUMBER,
  whatsappSales: WHATSAPP_NUMBER,
  whatsappSupport: WHATSAPP_NUMBER,
  whatsappBulk: WHATSAPP_NUMBER,
  email: BUSINESS_EMAIL,
  address: BUSINESS_ADDRESS,
  businessHours: 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM',
  mapUrl: 'https://www.google.com/maps?q=Begusarai+Bihar+India',
  socialMedia: {
    facebook: 'https://facebook.com/curtavra',
    instagram: 'https://instagram.com/curtavra',
    pinterest: 'https://pinterest.com/curtavra',
    youtube: 'https://youtube.com/curtavra',
  },
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  // Firestore-backed state
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  
  // Local storage backed state (user-specific, not business data)
  const [wishlist, setWishlist] = useState<string[]>(() => loadFromStorage('wishlist', []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => loadFromStorage('recentlyViewed', []));

  // Save user-specific data to localStorage
  useEffect(() => { saveToStorage('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { saveToStorage('recentlyViewed', recentlyViewed); }, [recentlyViewed]);

  // ============================================
  // FIRESTORE REAL-TIME LISTENERS
  // ============================================

  useEffect(() => {
    // Products listener
    const productsUnsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (productsData.length === 0) {
          setProducts(SAMPLE_PRODUCTS);
        } else {
          setProducts(productsData);
        }
      },
      (error) => {
        console.error('❌ Products listener error:', error);
        setProducts(SAMPLE_PRODUCTS);
      }
    );

    // Testimonials listener
    const testimonialsUnsubscribe = onSnapshot(
      collection(db, 'testimonials'),
      (snapshot) => {
        const testimonialsData: Testimonial[] = [];
        snapshot.forEach((doc) => {
          testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial);
        });

        if (testimonialsData.length === 0) {
          setTestimonials(SAMPLE_TESTIMONIALS);
        } else {
          setTestimonials(testimonialsData);
        }
      },
      (error) => {
        console.error('❌ Testimonials listener error:', error);
        setTestimonials(SAMPLE_TESTIMONIALS);
      }
    );

    // FAQs listener
    const faqsUnsubscribe = onSnapshot(
      collection(db, 'faqs'),
      (snapshot) => {
        const faqsData: FAQ[] = [];
        snapshot.forEach((doc) => {
          faqsData.push({ id: doc.id, ...doc.data() } as FAQ);
        });

        if (faqsData.length === 0) {
          setFaqs(SAMPLE_FAQS);
        } else {
          setFaqs(faqsData);
        }
      },
      (error) => {
        console.error('❌ FAQs listener error:', error);
        setFaqs(SAMPLE_FAQS);
      }
    );

    // Contact Info listener (single document)
    const contactInfoUnsubscribe = onSnapshot(
      doc(db, 'settings', 'contactInfo'),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setContactInfo(docSnapshot.data() as ContactInfo);
        } else {
          setContactInfo(defaultContactInfo);
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Contact info listener error:', error);
        setContactInfo(defaultContactInfo);
        setLoading(false);
      }
    );

    // Reviews listener
    const reviewsUnsubscribe = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        const reviewsData: Review[] = [];
        snapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() } as Review);
        });
        reviewsData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(reviewsData);
      },
      (error) => {
        console.error('❌ Reviews listener error:', error);
        setReviews([]);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      productsUnsubscribe();
      testimonialsUnsubscribe();
      faqsUnsubscribe();
      contactInfoUnsubscribe();
      reviewsUnsubscribe();
    };
  }, []);

  // Inquiries are admin-only (Firestore rules deny reads for everyone else).
  // Subscribing only when the user is an admin avoids guaranteed
  // permission-denied errors in every visitor's console.
  useEffect(() => {
    if (!isAdmin) {
      setInquiries([]);
      return;
    }

    const inquiriesUnsubscribe = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        const inquiriesData: Inquiry[] = [];
        snapshot.forEach((docSnapshot) => {
          inquiriesData.push({ id: docSnapshot.id, ...docSnapshot.data() } as Inquiry);
        });
        inquiriesData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setInquiries(inquiriesData);
      },
      (error) => {
        console.error('Inquiries listener error:', error);
        setInquiries([]);
      }
    );

    return () => inquiriesUnsubscribe();
  }, [isAdmin]);

  // ============================================
  // PRODUCT OPERATIONS
  // ============================================

  const addProduct = useCallback(async (product: Product) => {
    try {
      const { id: _id, ...productData } = product;
      await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }, []);

  // ============================================
  // TESTIMONIAL OPERATIONS
  // ============================================

  const addTestimonial = useCallback(async (testimonial: Testimonial) => {
    try {
      const { id: _id, ...testimonialData } = testimonial;
      await addDoc(collection(db, 'testimonials'), testimonialData);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  }, []);

  const updateTestimonial = useCallback(async (id: string, updates: Partial<Testimonial>) => {
    try {
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, updates);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  }, []);

  // ============================================
  // FAQ OPERATIONS
  // ============================================

  const addFaq = useCallback(async (faq: FAQ) => {
    try {
      const { id: _id, ...faqData } = faq;
      await addDoc(collection(db, 'faqs'), faqData);
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  }, []);

  const updateFaq = useCallback(async (id: string, updates: Partial<FAQ>) => {
    try {
      const faqRef = doc(db, 'faqs', id);
      await updateDoc(faqRef, updates);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }, []);

  const deleteFaq = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }, []);

  // ============================================
  // INQUIRY OPERATIONS
  // ============================================

  const addInquiry = useCallback(async (inquiry: Inquiry) => {
    try {
      const { id: _id, ...inquiryData } = inquiry;
      await addDoc(collection(db, 'inquiries'), {
        ...inquiryData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding inquiry:', error);
      throw error;
    }
  }, []);

  const updateInquiryStatus = useCallback(async (id: string, status: Inquiry['status']) => {
    try {
      const inquiryRef = doc(db, 'inquiries', id);
      await updateDoc(inquiryRef, { status });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  }, []);

  // ============================================
  // CONTACT INFO OPERATIONS
  // ============================================

  const updateContactInfo = useCallback(async (info: Partial<ContactInfo>) => {
    try {
      const contactRef = doc(db, 'settings', 'contactInfo');
      const currentDoc = await getDoc(contactRef);
      
      if (currentDoc.exists()) {
        await updateDoc(contactRef, info);
      } else {
        await setDoc(contactRef, { ...defaultContactInfo, ...info });
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }, []);

  // ============================================
  // REVIEW OPERATIONS
  // ============================================

  const addReview = useCallback(async (review: Review) => {
    try {
      const reviewDoc: Record<string, unknown> = {
        userName: review.userName,
        userEmail: review.userEmail || '',
        rating: review.rating,
        title: review.title || '',
        text: review.text,
        productId: review.productId || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      if (review.productName) {
        reviewDoc.productName = review.productName;
      }

      await addDoc(collection(db, 'reviews'), reviewDoc);
    } catch (error) {
      console.error('Error adding review to Firestore:', error);
      throw error;
    }
  }, []);

  const updateReview = useCallback(async (id: string, updates: Partial<Review>) => {
    try {
      const cleanUpdates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updates)) {
        cleanUpdates[key] = value === undefined ? '' : value;
      }
      const reviewRef = doc(db, 'reviews', id);
      await updateDoc(reviewRef, cleanUpdates);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }, []);

  const getApprovedReviews = useCallback(() => {
    return reviews.filter(r => r.status === 'approved');
  }, [reviews]);

  const getReviewsByProduct = useCallback((productId: string) => {
    return reviews.filter(r => r.productId === productId && r.status === 'approved');
  }, [reviews]);

  const getAverageRating = useCallback(() => {
    const approved = reviews.filter(r => r.status === 'approved');
    if (approved.length === 0) return { avg: 0, count: 0 };
    const total = approved.reduce((sum, r) => sum + r.rating, 0);
    return { avg: parseFloat((total / approved.length).toFixed(1)), count: approved.length };
  }, [reviews]);

  // ============================================
  // LOCAL OPERATIONS (Wishlist & Recently Viewed)
  // ============================================

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

  // ============================================
  // QUERY HELPERS
  // ============================================

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

  const storeValue = useMemo(() => ({
    products,
    testimonials,
    faqs,
    inquiries,
    reviews,
    wishlist,
    recentlyViewed,
    contactInfo,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addFaq,
    updateFaq,
    deleteFaq,
    addInquiry,
    updateInquiryStatus,
    addReview,
    updateReview,
    deleteReview,
    getApprovedReviews,
    getReviewsByProduct,
    getAverageRating,
    toggleWishlist,
    addToRecentlyViewed,
    updateContactInfo,
    getProductBySlug,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getBestSellers,
    getNewArrivals,
    searchProducts,
  }), [
    products,
    testimonials,
    faqs,
    inquiries,
    reviews,
    wishlist,
    recentlyViewed,
    contactInfo,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addFaq,
    updateFaq,
    deleteFaq,
    addInquiry,
    updateInquiryStatus,
    addReview,
    updateReview,
    deleteReview,
    getApprovedReviews,
    getReviewsByProduct,
    getAverageRating,
    toggleWishlist,
    addToRecentlyViewed,
    updateContactInfo,
    getProductBySlug,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getBestSellers,
    getNewArrivals,
    searchProducts,
  ]);

  return (
    <StoreContext.Provider value={storeValue}>
      {children}
    </StoreContext.Provider>
  );
}
