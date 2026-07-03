import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

// Pages
const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const CustomOrder = lazy(() => import('@/pages/CustomOrder'));
const Installation = lazy(() => import('@/pages/Installation'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const QuoteRequest = lazy(() => import('@/pages/QuoteRequest'));
const Login = lazy(() => import('@/pages/Login'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin
const AdminLayout = lazy(() => import('@/pages/Admin/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/Admin/AdminProducts'));
const AdminInquiries = lazy(() => import('@/pages/Admin/AdminInquiries'));
const AdminTestimonials = lazy(() => import('@/pages/Admin/AdminTestimonials'));
const AdminFAQs = lazy(() => import('@/pages/Admin/AdminFAQs'));
const AdminContact = lazy(() => import('@/pages/Admin/AdminContact'));
const AdminUsers = lazy(() => import('@/pages/Admin/AdminUsers'));
const AdminSettings = lazy(() => import('@/pages/Admin/AdminSettings'));
const AdminGallery = lazy(() => import('@/pages/Admin/AdminGallery'));
const AdminReviews = lazy(() => import('@/pages/Admin/AdminReviews'));

function ScrollToTop(): null {
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
        <p className="text-stone-400 text-sm">Loading Curtavra...</p>
      </div>
    </div>
  );
}

export default function App() {
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
        
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>
      </StoreProvider>
    </AuthProvider>
  );
}
