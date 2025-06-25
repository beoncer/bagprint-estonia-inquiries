import { createClient } from '@supabase/supabase-js'
import { ProductColor } from './constants'

// Singleton pattern to prevent multiple client instances
const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc'

// Verify Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create single instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// For server-side operations - use same singleton pattern
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzgxNDU3NSwiZXhwIjoyMDYzMzkwNTc1fQ.2fW1J9z8RQAd3WopZHjQ-rSwaf5exwneU1MfQ_DgJME'

let adminClientInstance: any = null;

export const supabaseAdmin = (() => {
  if (!adminClientInstance) {
    adminClientInstance = createClient(supabaseUrl, supabaseServiceKey);
  }
  return adminClientInstance;
})();

export interface Product {
  id: string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  image: string;
  base_price: number;
  slug: string;
  created_at: string;
  updated_at: string;
  colors: ProductColor[];
  sizes: string[];
  is_eco?: boolean;
  badges: string[];
  category: string;
  is_popular?: boolean;
  material?: string;
  color_images?: Record<string, string>;
  size_images?: Record<string, string>;
  additional_images?: string[];
  main_color?: string;
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
      type: item.type,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url,
      image: item.image_url || '/placeholder.svg',
      base_price: item.base_price || 0,
      slug: item.slug || `${item.type}-${item.id}`,
      created_at: item.created_at,
      updated_at: item.updated_at,
      colors: item.colors || [],
      sizes: item.sizes || [],
      is_eco: item.is_eco || false,
      badges: item.badges || [],
      category: item.type,
      is_popular: item.is_popular || false,
      material: item.material,
      color_images: item.color_images || {},
      size_images: item.size_images || {},
      additional_images: item.additional_images || [],
      main_color: item.main_color || null,
    })) as Product[];
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

  return {
    ...data,
    category: data.type,
    image: data.color_images && data.main_color ? data.color_images[data.main_color] : (data.image_url || '/placeholder.svg'),
    colors: data.colors || [],
    sizes: data.sizes || [],
    badges: data.badges || [],
    slug: data.slug || `${data.type}-${data.id}`,
    base_price: data.base_price || 0,
    material: data.material,
    color_images: data.color_images || {},
    size_images: data.size_images || {},
    additional_images: data.additional_images || [],
    main_color: data.main_color || null,
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

  return products.map(data => ({
    ...data,
    category: data.type,
    image: data.image_url || '/placeholder.svg',
    sizes: data.sizes || [],
    slug: data.slug || `${data.type}-${data.id}`,
    base_price: data.base_price || 0,
    material: data.material,
    color_images: data.color_images || {},
    size_images: data.size_images || {},
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
      
      const contentObj: any = {};
      contentData.forEach((item: any) => {
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
