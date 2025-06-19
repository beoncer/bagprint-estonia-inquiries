import { createClient } from '@supabase/supabase-js'
import { ProductColor } from './constants'

// Try to get from environment variables first, fallback to hardcoded values
const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc'

// Verify Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that require higher privileges
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzgxNDU3NSwiZXhwIjoyMDYzMzkwNTc1fQ.2fW1J9z8RQAd3WopZHjQ-rSwaf5exwneU1MfQ_DgJME'
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface Product {
  id: string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  image?: string;
  pricing_without_print: Record<string, number>;
  pricing_with_print: Record<string, number>;
  slug?: string | null;
  created_at: string;
  updated_at: string;
  colors: ProductColor[];
  is_eco?: boolean;
  badges: string[];
  category?: string;
  startingPrice?: number;
  is_popular?: boolean;
}

function extractStartingPrice(pricing: any): number | undefined {
  if (!pricing) return undefined;
  try {
    const parsed = typeof pricing === "string" ? JSON.parse(pricing) : pricing;
    const prices = Object.values(parsed).map(Number).filter(n => !isNaN(n));
    return prices.length ? Math.min(...prices) : undefined;
  } catch {
    return undefined;
  }
}

export async function getProducts() {
  try {
    console.log('Attempting to fetch products from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    console.log('Successfully fetched products:', data);
    return (data || []).map((item: any) => {
      // Safely parse pricing data
      const pricingWithoutPrint = typeof item.pricing_without_print === 'string' 
        ? JSON.parse(item.pricing_without_print) 
        : (item.pricing_without_print || {});

      // Calculate starting price safely with validation
      let startingPrice: number | undefined = undefined;
      const priceValues = Object.values(pricingWithoutPrint);
      if (priceValues.length > 0) {
        const validPrices = priceValues
          .map(price => typeof price === 'number' ? price : parseFloat(price as string))
          .filter(price => !isNaN(price));
        if (validPrices.length > 0) {
          startingPrice = Math.min(...validPrices);
        }
      }

      return {
        id: item.id,
        type: item.type,
        name: item.name,
        description: item.description || '',
        image_url: item.image_url,
        image: item.image_url,
        pricing_without_print: pricingWithoutPrint,
        pricing_with_print: typeof item.pricing_with_print === 'string' 
          ? JSON.parse(item.pricing_with_print) 
          : (item.pricing_with_print || {}),
        slug: item.slug,
        created_at: item.created_at,
        updated_at: item.updated_at,
        colors: item.colors || [],
        is_eco: item.is_eco || false,
        badges: item.badges || [],
        category: item.type,
        startingPrice,
        is_popular: item.is_popular || false,
      };
    }) as Product[];
  } catch (err) {
    console.error('Unexpected error in getProducts:', err);
    throw err;
  }
}

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;

  // Transform the data to match our interface
  return {
    ...data,
    category: data.type, // Map type to category
    startingPrice: data.pricing_without_print ? 
      Math.min(...Object.values(data.pricing_without_print)) : 
      undefined,
    image: data.image_url, // Map image_url to image for backward compatibility
    colors: data.colors || [],
    badges: data.badges || [], // Include badges with default empty array
  };
};

export async function getPopularProducts(): Promise<Product[]> {
  const { data: popularProductIds } = await supabase
    .from('popular_products')
    .select('product_id');

  if (!popularProductIds?.length) return [];

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .in('id', popularProductIds.map(p => p.product_id));

  if (error) throw error;

  // Transform the data to match our interface
  return products.map(data => ({
    ...data,
    category: data.type,
    startingPrice: data.pricing_without_print ? 
      Math.min(...Object.values(data.pricing_without_print as Record<string, number>)) : 
      undefined,
    image: data.image_url,
  })) as Product[];
}

export async function getSiteContent() {
  try {
    console.log('Attempting to fetch site content from Supabase...');
    
    const { data: contentData, error: contentError } = await supabase
      .from('website_content')
      .select('*');

    if (contentError) {
      console.error('Error fetching website_content:', contentError);
      return {};
    }

    if (contentData && contentData.length > 0) {
      console.log('Fetched website_content data:', contentData);
      
      // Convert array to object for easier access
      const contentObj: any = {};
      contentData.forEach((item: any) => {
        // Use value if it exists, otherwise use link (for URLs)
        contentObj[item.key] = item.value || item.link;
      });
      
      console.log('Converted content object:', contentObj);
      console.log('Product category 3 image specifically:', contentObj.product_category_3_image);
      return contentObj;
    }

    console.log('No data found in website_content, returning empty object');
    return {};
  } catch (err) {
    console.error('Unexpected error in getSiteContent:', err);
    return {};
  }
}
