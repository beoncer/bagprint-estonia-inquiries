import { useEffect } from 'react';
import { Product } from '@/types/product';

interface ProductStructuredDataProps {
  product: Product;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  price?: number;
  priceCurrency?: string;
}

const CATEGORY_LABELS_ET: Record<string, string> = {
  cotton_bag: "Riidest kotid",
  paper_bag: "Paberkotid",
  drawstring_bag: "Nööriga kotid",
  shoebag: "Sussikotid",
  packaging: "E-poe pakendid",
  // Add more as needed
};

const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  product,
  availability = 'InStock',
  price,
  priceCurrency = 'EUR'
}) => {
  useEffect(() => {
    // Remove any existing product structured data
    const existingScript = document.querySelector('script[data-product-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `Kvaliteetne ${product.type} - ${product.name}`,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": "Leatex"
      },
      "category": CATEGORY_LABELS_ET[product.category] || CATEGORY_LABELS_ET[product.type] || product.category,
      "url": `https://leatex.ee/tooted/${product.slug}`,
      "sku": product.id,
      "mpn": product.id,
      "availability": `https://schema.org/${availability}`,
      "offers": {
        "@type": "Offer",
        "price": price || product.base_price,
        "priceCurrency": priceCurrency,
        "availability": `https://schema.org/${availability}`,
        "seller": {
          "@type": "Organization",
          "name": "Leatex"
        },
        "url": `https://leatex.ee/tooted/${product.slug}`
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Material",
          "value": product.material || "Puuvill"
        },
        {
          "@type": "PropertyValue", 
          "name": "Color",
          "value": product.colors?.join(', ') || "Mitmesugused värvid"
        },
        {
          "@type": "PropertyValue",
          "name": "Size",
          "value": product.sizes?.join(', ') || "Mitmesugused suurused"
        }
      ]
    };

    // Add eco-friendly properties if applicable
    if (product.is_eco || product.badges?.includes('eco')) {
      structuredData.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Eco-Friendly",
        "value": "Jah"
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-product-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[data-product-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product, availability, price, priceCurrency]);

  return null;
};

export default ProductStructuredData;
