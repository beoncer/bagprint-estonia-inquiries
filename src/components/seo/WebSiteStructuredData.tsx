
import { useEffect } from 'react';

interface WebSiteStructuredDataProps {
  name?: string;
  url?: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
}

const WebSiteStructuredData: React.FC<WebSiteStructuredDataProps> = ({
  name = "Leatex",
  url = "https://leatex.ee",
  description = "Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga",
  logo = "https://leatex.ee/logo.png",
  sameAs = [
    "https://www.facebook.com/leatexee",
    "https://www.instagram.com/leatexee",
    "https://www.linkedin.com/company/leatex"
  ]
}) => {
  useEffect(() => {
    // Remove any existing website structured data
    const existingScript = document.querySelector('script[data-website-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": name,
      "url": url,
      "description": description,
      "image": logo,
      "sameAs": sameAs,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${url}/tooted?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "mainEntity": {
        "@type": "Organization",
        "name": name,
        "url": url,
        "logo": logo
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-website-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[data-website-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, url, description, logo, sameAs]);

  return null;
};

export default WebSiteStructuredData;
