
import { Json } from "@/integrations/supabase/types";
import { ProductProps } from "@/components/product/ProductCard";

interface RawProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  type: string;
  pricing_without_print: Json;
  pricing_with_print: Json;
  created_at?: string;
  updated_at?: string;
}

/**
 * Convert a product from the database to the format used by the UI
 */
export const processProductData = (product: RawProduct): ProductProps => {
  try {
    // Parse pricing objects if needed
    let pricingWithoutPrint: Record<string, number> = {};
    
    if (typeof product.pricing_without_print === 'string') {
      pricingWithoutPrint = JSON.parse(product.pricing_without_print);
    } else if (product.pricing_without_print && typeof product.pricing_without_print === 'object') {
      // Handle case when it's already an object
      pricingWithoutPrint = product.pricing_without_print as Record<string, number>;
    }
    
    // Calculate starting price (minimum price from pricing_without_print)
    const priceValues = Object.values(pricingWithoutPrint || {}).map(p => Number(p));
    const startingPrice = priceValues.length > 0 
      ? Math.min(...priceValues)
      : 0;
    
    // Map product type to category
    let category: string;
    switch (product.type) {
      case "cotton_bag": category = "cotton"; break;
      case "paper_bag": category = "paper"; break;
      case "drawstring_bag": category = "drawstring"; break;
      case "packaging_box": category = "packaging"; break;
      default: category = "other";
    }
    
    return {
      id: product.id,
      name: product.name,
      description: product.description || "",
      image: product.image_url || "/placeholder.svg", // Use placeholder if no image
      category,
      startingPrice,
    };
  } catch (err) {
    console.error(`Error processing product ${product.name}:`, err);
    // Return a default product with error indication
    return {
      id: product.id,
      name: product.name,
      description: product.description || "Error loading product details",
      image: "/placeholder.svg",
      category: "other",
      startingPrice: 0,
    };
  }
};
