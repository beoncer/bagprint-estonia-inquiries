import { useEffect } from 'react';

interface OrganizationStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  sameAs?: string[];
}

const OrganizationStructuredData: React.FC<OrganizationStructuredDataProps> = ({
  name = "Leatex",
  description = "Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga",
  url = "https://leatex.ee",
  logo = "https://leatex.ee/logo.png",
  phone = "+372 5555 5555",
  email = "info@leatex.ee",
  address = {
    streetAddress: "Tartu mnt 123",
    addressLocality: "Tallinn",
    postalCode: "10115",
    addressCountry: "EE"
  },
  geo = {
    latitude: 59.436962,
    longitude: 24.753574
  },
  openingHours = [
    "Mo-Fr 09:00-18:00",
    "Sa 10:00-16:00"
  ],
  sameAs = [
    "https://www.facebook.com/leatexee",
    "https://www.instagram.com/leatexee",
    "https://www.linkedin.com/company/leatex"
  ]
}) => {
  useEffect(() => {
    // Remove any existing organization structured data
    const existingScript = document.querySelector('script[data-organization-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": name,
      "description": description,
      "url": url,
      "logo": {
        "@type": "ImageObject",
        "url": logo
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": phone,
          "contactType": "customer service",
          "availableLanguage": ["Estonian", "English"],
          "areaServed": "EE"
        },
        {
          "@type": "ContactPoint",
          "email": email,
          "contactType": "customer service"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress,
        "addressLocality": address.addressLocality,
        "postalCode": address.postalCode,
        "addressCountry": address.addressCountry
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      },
      "openingHours": openingHours,
      "sameAs": sameAs,
      "foundingDate": "2020",
      "numberOfEmployees": "5-10",
      "priceRange": "€€",
      "paymentAccepted": [
        "Cash",
        "Credit Card",
        "Bank Transfer",
        "Invoice"
      ],
      "currenciesAccepted": "EUR",
      "areaServed": [
        {
          "@type": "Country",
          "name": "Estonia"
        },
        {
          "@type": "Country", 
          "name": "Latvia"
        },
        {
          "@type": "Country",
          "name": "Lithuania"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Bag Products",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Puuvillakotid"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Product",
              "name": "Paberkotid"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product", 
              "name": "Nööriga kotid"
            }
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-organization-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[data-organization-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, description, url, logo, phone, email, address, geo, openingHours, sameAs]);

  return null;
};

export default OrganizationStructuredData;
