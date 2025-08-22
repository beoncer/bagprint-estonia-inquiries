import type { StaticProduct } from '../lib/static-data'

export const productLd = (product: StaticProduct) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.seo_title || product.name,
  description: product.seo_description || product.description,
  sku: product.model || product.id,
  brand: {
    "@type": "Brand",
    name: "Bagprint"
  },
  material: product.material,
  color: product.main_color,
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: product.base_price,
    availability: "https://schema.org/InStock",
    url: `https://bagprint.ee/tooted/${product.slug}`,
    seller: {
      "@type": "Organization",
      name: "Bagprint"
    }
  },
  image: product.color_images && product.main_color 
    ? product.color_images[product.main_color] 
    : product.image_url,
  category: product.type,
  additionalProperty: [
    ...(product.sizes?.map(size => ({
      "@type": "PropertyValue",
      name: "Size",
      value: size
    })) || []),
    ...(product.colors?.map(color => ({
      "@type": "PropertyValue", 
      name: "Color",
      value: color
    })) || [])
  ]
})

export const breadcrumbLd = (product: StaticProduct) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Kodu",
      item: "https://bagprint.ee/"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tooted",
      item: "https://bagprint.ee/tooted"
    },
    {
      "@type": "ListItem",
      position: 3,
      name: product.name,
      item: `https://bagprint.ee/tooted/${product.slug}`
    }
  ]
})

export const categoryLd = () => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tooted",
  description: "Kangakotid, paberikotid ja pakendikarbid kohandatud trükiga",
  url: "https://bagprint.ee/tooted",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Kodu",
        item: "https://bagprint.ee/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tooted",
        item: "https://bagprint.ee/tooted"
      }
    ]
  }
})