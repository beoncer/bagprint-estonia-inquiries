import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc'

// Verify Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// For server-side operations that require higher privileges
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzgxNDU3NSwiZXhwIjoyMDYzMzkwNTc1fQ.2fW1J9z8RQAd3WopZHjQ-rSwaf5exwneU1MfQ_DgJME'
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  startingPrice?: number;
  slug: string;
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
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image_url,
      category: item.type,
      startingPrice: extractStartingPrice(item.pricing_without_print),
      slug: item.slug,
      is_popular: item.is_popular || false,
    })) as Product[];
  } catch (err) {
    console.error('Unexpected error in getProducts:', err);
    throw err;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image_url,
      category: data.type,
      startingPrice: extractStartingPrice(data.pricing_without_print),
      slug: data.slug,
    } as Product;
  } catch (err) {
    console.error('Unexpected error in getProductBySlug:', err);
    throw err;
  }
}

export async function getPopularProducts() {
  // Fetch popular product IDs from popular_products table
  const { data: popularRows, error: popularError } = await supabase
    .from('popular_products')
    .select('product_id');

  if (popularError) throw popularError;

  console.log('Fetched popular_products rows:', popularRows);

  const popularIds = (popularRows || []).map(row => row.product_id);
  if (popularIds.length === 0) {
    console.log('No popular product IDs found.');
    return [];
  }

  // Fetch product details for those IDs
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', popularIds);

  if (productsError) throw productsError;

  console.log('Fetched products for popular IDs:', products);

  return (products || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image_url,
    category: item.type,
    startingPrice: extractStartingPrice(item.pricing_without_print),
    slug: item.slug,
  })) as Product[];
}

export async function getSiteContent() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching site content:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in getSiteContent:', err);
    throw err;
  }
}
