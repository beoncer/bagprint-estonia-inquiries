
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { ProductProps } from "@/components/product/ProductCard";

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
  console.log("Raw pricing data:", pricingData);
  
  // If it's null or undefined, return empty object
  if (pricingData === null || pricingData === undefined) {
    console.log("Pricing data is null or undefined, returning empty object");
    return {};
  }
  
  // If it's already an object, return it directly
  if (typeof pricingData === 'object') {
    console.log("Pricing data is an object");
    return pricingData as Record<string, number>;
  }
  
  // If it's a string, try to parse it
  if (typeof pricingData === 'string') {
    try {
      console.log("Pricing data is a string, parsing");
      return JSON.parse(pricingData);
    } catch (err) {
      console.error("Error parsing pricing data string:", err);
      return {};
    }
  }
  
  console.log("Pricing data is of unexpected type, returning empty object");
  return {};
};

/**
 * Converts a product type to a category string
 */
export const mapProductTypeToCategory = (type: string): string => {
  console.log("Mapping product type:", type);
  switch (type?.toLowerCase()) {
    case "cotton_bag": return "cotton";
    case "paper_bag": return "paper";
    case "drawstring_bag": return "drawstring";
    case "packaging_box": return "packaging";
    default: 
      console.log(`Unknown product type: ${type}, defaulting to "other"`);
      return "other";
  }
};

/**
 * Gets the minimum price from pricing data
 */
export const getStartingPrice = (pricingData: Record<string, number>): number => {
  console.log("Getting starting price from:", pricingData);
  if (!pricingData || Object.keys(pricingData).length === 0) {
    console.log("No pricing data available, using default price 0");
    return 0;
  }
  
  // Filter out non-numeric values and convert string numbers to actual numbers
  const priceValues = Object.values(pricingData)
    .filter(p => !isNaN(Number(p)))
    .map(p => Number(p));
  
  console.log("Valid price values:", priceValues);
  return priceValues.length > 0 ? Math.min(...priceValues) : 0;
};

/**
 * Processes raw product data from Supabase into the format needed by the UI
 */
export const processProductData = (product: RawProduct): ProductProps => {
  try {
    console.log("Processing product:", product);
    
    if (!product || !product.id) {
      throw new Error("Invalid product data");
    }
    
    // Parse pricing data
    const pricingWithoutPrint = parsePricingData(product.pricing_without_print);
    console.log(`Pricing data for ${product.name}:`, pricingWithoutPrint);
    
    // Calculate starting price
    const startingPrice = getStartingPrice(pricingWithoutPrint);
    
    // Map product type to category
    const category = mapProductTypeToCategory(product.type);
    console.log(`Category for ${product.name}: ${category}`);
    
    const processedProduct = {
      id: product.id,
      name: product.name || "Unnamed Product",
      description: product.description || "",
      image: product.image_url || "/placeholder.svg",
      category,
      startingPrice,
    };
    
    console.log("Processed product:", processedProduct);
    return processedProduct;
  } catch (err) {
    console.error(`Error processing product:`, err);
    return {
      id: product?.id || "error-id",
      name: product?.name || "Error Loading Product",
      description: "Error loading product details",
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
    
    const { data, error } = await supabase
      .from("products")
      .select("*");
    
    console.log("Supabase response:", { data, error });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No products found in database");
      return [];
    }
    
    // Process the products data
    const processedProducts = data.map((product: RawProduct) => processProductData(product));
    console.log("Processed products:", processedProducts);
    
    return processedProducts;
  } catch (err) {
    console.error("Error in fetchAllProducts:", err);
    return [];
  }
};

/**
 * Fetches popular products from Supabase
 */
export const fetchPopularProducts = async (): Promise<ProductProps[]> => {
  try {
    console.log("Fetching popular products...");
    
    // First check if we have any popular products
    const { data: popularData, error: popularError } = await supabase
      .from('popular_products')
      .select('product_id');
    
    console.log("Popular products response:", { popularData, popularError });
    
    if (popularError) {
      console.error('Error fetching popular products:', popularError);
      return fetchSomeFallbackProducts();
    }
    
    if (!popularData || popularData.length === 0) {
      console.log("No popular products found - fetching some regular products instead");
      return fetchSomeFallbackProducts();
    }
    
    // Extract product IDs
    const productIds = popularData.map(item => item.product_id);
    console.log("Popular product IDs:", productIds);
    
    // Fetch the actual product details
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    console.log("Popular product details response:", { productsData, productsError });
    
    if (productsError) {
      console.error('Error fetching product details:', productsError);
      return fetchSomeFallbackProducts();
    }
    
    if (!productsData || productsData.length === 0) {
      console.log("No product details found for popular products");
      return fetchSomeFallbackProducts();
    }
    
    // Process the products data
    const processedProducts = productsData.map((product: RawProduct) => processProductData(product));
    console.log("Processed featured products:", processedProducts);
    
    return processedProducts;
  } catch (err) {
    console.error('Error processing popular products:', err);
    return fetchSomeFallbackProducts();
  }
};

/**
 * Fallback function to fetch regular products when popular ones aren't available
 */
const fetchSomeFallbackProducts = async (): Promise<ProductProps[]> => {
  console.log("Fetching fallback products");
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(4);
      
    console.log("Fallback products response:", { data, error });
    
    if (error) {
      console.error('Error fetching fallback products:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("No fallback products found");
      return [];
    }
    
    const processedProducts = data.map((product: RawProduct) => processProductData(product));
    console.log("Processed fallback products:", processedProducts);
    
    return processedProducts;
  } catch (err) {
    console.error('Error in fetchSomeFallbackProducts:', err);
    return [];
  }
};
