import { Helmet } from 'react-helmet-async';
import { Product } from '@/lib/supabase';

interface SSRHelmetProps {
  product?: Product;
  pageType?: string;
  url?: string;
  seoData?: any;
}

const SSRHelmet: React.FC<SSRHelmetProps> = ({ product, pageType, url, seoData }) => {
  if (product) {
    const title = product.seo_title || `${product.name} - Leatex`;
    const description = product.seo_description || `${product.name} - kvaliteetne ${product.type} kohandatud trükiga. ${product.description}`;
    const keywords = product.seo_keywords || `${product.type}, kotid, trükk, pakendid, Leatex`;
    const canonicalUrl = `https://leatex.ee/tooted/${product.slug}`;
    
    // Create structured data for product
    const productLD = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": "Leatex"
      },
      "category": product.category,
      "url": canonicalUrl,
      "image": product.image,
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "EUR",
        "seller": {
          "@type": "Organization",
          "name": "Leatex"
        }
      }
    };

    return (
      <Helmet>
        <html lang="et" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={product.image} />
        <meta property="og:site_name" content="Leatex" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={product.image} />
        
        <script type="application/ld+json">
          {JSON.stringify(productLD)}
        </script>
      </Helmet>
    );
  }

  // Use SEO data from database if available, otherwise fallback to defaults
  const title = seoData?.title || "Leatex - Kvaliteetsed kotid ja pakendid";
  const description = seoData?.description || "Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Küsi pakkumist juba täna!";
  const keywords = seoData?.keywords || "kotid, puuvillakotid, paberkotid, trükk, pakendid, Leatex";
  const canonicalUrl = `https://leatex.ee${url || ''}`;

  return (
    <Helmet>
      <html lang="et" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Leatex" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SSRHelmet;