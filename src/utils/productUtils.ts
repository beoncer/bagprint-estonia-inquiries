
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { ProductProps } from "@/components/product/ProductCard";
import { toast } from "@/hooks/use-toast";

export interface RawProduct {
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
 * Safely parses JSON pricing data
 */
export const parsePricingData = (pricingData: Json): Record<string, number> => {
  try {
    if (typeof pricingData === 'string') {
      return JSON.parse(pricingData);
    } 
    
    if (pricingData && typeof pricingData === 'object') {
      return pricingData as Record<string, number>;
    }
    
    return {};
  } catch (err) {
    console.error("Error parsing pricing data:", err);
    return {};
  }
};

/**
 * Converts a product type to a category string
 */
export const mapProductTypeToCategory = (type: string): string => {
  switch (type) {
    case "cotton_bag": return "cotton";
    case "paper_bag": return "paper";
    case "drawstring_bag": return "drawstring";
    case "packaging_box": return "packaging";
    default: return "other";
  }
};

/**
 * Gets the minimum price from pricing data
 */
export const getStartingPrice = (pricingData: Record<string, number>): number => {
  const priceValues = Object.values(pricingData).map(p => Number(p));
  return priceValues.length > 0 ? Math.min(...priceValues) : 0;
};

/**
 * Processes raw product data from Supabase into the format needed by the UI
 */
export const processProductData = (product: RawProduct): ProductProps => {
  try {
    console.log(`Processing product: ${product.name}, type: ${product.type}, id: ${product.id}`);
    
    // Parse pricing data
    const pricingWithoutPrint = parsePricingData(product.pricing_without_print);
    console.log(`Pricing data for ${product.name}:`, pricingWithoutPrint);
    
    // Calculate starting price
    const startingPrice = getStartingPrice(pricingWithoutPrint);
    
    // Map product type to category
    const category = mapProductTypeToCategory(product.type);
    
    return {
      id: product.id,
      name: product.name,
      description: product.description || "",
      image: product.image_url || "/placeholder.svg",
      category,
      startingPrice,
    };
  } catch (err) {
    console.error(`Error processing product ${product.name}:`, err);
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

/**
 * Fetches all products from Supabase
 */
export const fetchAllProducts = async (): Promise<ProductProps[]> => {
  try {
    console.log("Fetching all products...");
    
    // Clear response before making a new request
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error loading products",
        description: "Could not load products. Please try again later."
      });
      return [];
    }
    
    console.log("Raw products data:", data);
    
    if (!data || data.length === 0) {
      console.log("No products found in database");
      return [];
    }
    
    // Process the products data
    const processedProducts = data.map((product: RawProduct) => processProductData(product));
    console.log("Processed products:", processedProducts);
    
    return processedProducts;
  } catch (err) {
    console.error("Error processing products:", err);
    toast({
      variant: "destructive",
      title: "Error processing products",
      description: "There was a problem preparing the products for display."
    });
    return [];
  }
};

/**
 * Fetches popular products from Supabase
 */
export const fetchPopularProducts = async (): Promise<ProductProps[]> => {
  try {
    console.log("Fetching popular products...");
    
    // Fetch popular products from the join table
    const { data: popularData, error: popularError } = await supabase
      .from('popular_products')
      .select('product_id');
    
    if (popularError) {
      console.error('Error fetching popular products:', popularError);
      return [];
    }
    
    console.log("Popular products data:", popularData);
    
    if (!popularData || popularData.length === 0) {
      console.log("No popular products found");
      return [];
    }
    
    // Extract product IDs
    const productIds = popularData.map(item => item.product_id);
    console.log("Popular product IDs:", productIds);
    
    // Fetch the actual product details
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    if (productsError) {
      console.error('Error fetching product details:', productsError);
      return [];
    }
    
    console.log("Popular products details:", productsData);
    
    if (!productsData || productsData.length === 0) {
      console.log("No popular product details found");
      return [];
    }
    
    // Process the products data
    const processedProducts = productsData.map((product: RawProduct) => processProductData(product));
    console.log("Processed featured products:", processedProducts);
    
    return processedProducts;
  } catch (err) {
    console.error('Error processing popular products:', err);
    toast({
      variant: "destructive",
      title: "Error loading featured products",
      description: "Could not load featured products. Using fallback products instead."
    });
    return [];
  }
};
