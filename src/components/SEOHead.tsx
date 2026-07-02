import { useEffect } from 'react';
import { BASE_URL } from '@/lib/constants';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/33839793/pexels-photo-33839793.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200';

export default function SEOHead({ title, description, canonical, ogImage, type = 'website', noindex = false, jsonLd }: SEOProps): null {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('name', 'googlebot', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('name', 'referrer', 'strict-origin-when-cross-origin');

    const pageUrl = canonical ? `${BASE_URL}${canonical}` : (typeof window !== 'undefined' ? `${BASE_URL}${window.location.pathname}${window.location.search}` : BASE_URL);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', ogImage || DEFAULT_IMAGE);
    setMeta('property', 'og:image:alt', title);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:site_name', 'LuxDrape');
    setMeta('property', 'og:locale', 'en_IN');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage || DEFAULT_IMAGE);
    setMeta('name', 'twitter:image:alt', title);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical ? `${BASE_URL}${canonical}` : pageUrl);

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo-page]');
    if (existingLd) existingLd.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-page', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.querySelector('script[data-seo-page]');
      if (ld) ld.remove();
    };
  }, [title, description, canonical, ogImage, type, noindex, jsonLd]);

  return null;
}
