export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: string;
  material: string;
  colors: string[];
  sizes: string[];
  images: string[];
  tags: string[];
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  careInstructions: string;
  installInfo: string;
  fabric: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'published' | 'draft';
  views?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  featured: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  text: string;
  createdAt: string;
  approved: boolean;
}

export interface Inquiry {
  id: string;
  type: 'product' | 'quote' | 'installation' | 'bulk' | 'general';
  name: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
  status: 'new' | 'in-progress' | 'completed' | 'closed';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'blocked';
  wishlist: string[];
  recentlyViewed: string[];
  createdAt: string;
}

export interface ContactInfo {
  phone: string;
  whatsappSales: string;
  whatsappSupport: string;
  whatsappBulk: string;
  email: string;
  address: string;
  businessHours: string;
  mapUrl: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    pinterest: string;
    youtube: string;
  };
}

export interface CustomOrder {
  width: string;
  height: string;
  fabric: string;
  style: string;
  rodType: string;
  layers: string;
  pleatStyle: string;
  quantity: number;
  notes: string;
}
