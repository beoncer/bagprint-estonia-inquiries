import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Leatex - Kvaliteetsed kotid ja pakendid",
  description = "Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Küsi pakkumist juba täna!",
  keywords = "kotid, puuvillakotid, paberkotid, paelaga kotid, pakendid, trükk, personaliseerimine, Estonia",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url,
  type = "website",
  canonical,
  noindex = false,
  nofollow = false
}) => {
  const fullUrl = url ? `https://bagprint.ee${url}` : "https://bagprint.ee";
  const canonicalUrl = canonical ? `https://bagprint.ee${canonical}` : fullUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      {noindex && <meta name="robots" content="noindex" />}
      {nofollow && <meta name="robots" content="nofollow" />}
      {!noindex && !nofollow && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Leatex" />
      <meta property="og:locale" content="et_EE" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@leatexee" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Leatex" />
      <meta name="language" content="et" />
      <meta name="geo.region" content="EE" />
      <meta name="geo.country" content="Estonia" />
      
      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Leatex",
          "url": "https://bagprint.ee",
          "logo": "https://bagprint.ee/logo.png",
          "description": "Kvaliteetsed kotid ja pakendid kohandatud trükiga",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Laki 7b",
            "addressLocality": "Tallinn",
            "addressCountry": "EE"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+372-5919-7172",
            "contactType": "customer service",
            "availableLanguage": "Estonian"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead; 