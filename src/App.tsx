import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

// Pages
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Gallery from '@/pages/Gallery';
import Reviews from '@/pages/Reviews';
import FAQ from '@/pages/FAQ';
import CustomOrder from '@/pages/CustomOrder';
import Installation from '@/pages/Installation';
import Wishlist from '@/pages/Wishlist';
import QuoteRequest from '@/pages/QuoteRequest';
import Login from '@/pages/Login';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';

// Admin
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import AdminProducts from '@/pages/Admin/AdminProducts';
import AdminInquiries from '@/pages/Admin/AdminInquiries';
import AdminTestimonials from '@/pages/Admin/AdminTestimonials';
import AdminFAQs from '@/pages/Admin/AdminFAQs';
import AdminContact from '@/pages/Admin/AdminContact';
import AdminUsers from '@/pages/Admin/AdminUsers';
import AdminSettings from '@/pages/Admin/AdminSettings';
import AdminGallery from '@/pages/Admin/AdminGallery';
import AdminReviews from '@/pages/Admin/AdminReviews';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-800 rounded-sm flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-heading font-bold text-2xl">L</span>
        </div>
        <p className="text-stone-400 text-sm">Loading LuxDrape...</p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';

  return (
    <AuthProvider>
      <StoreProvider>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1c1917',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />
        
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
          <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/custom-order" element={<PublicLayout><CustomOrder /></PublicLayout>} />
          <Route path="/installation" element={<PublicLayout><Installation /></PublicLayout>} />
          <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
          <Route path="/quote-request" element={<PublicLayout><QuoteRequest /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </StoreProvider>
    </AuthProvider>
  );
}
