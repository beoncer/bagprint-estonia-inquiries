import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fetchData() {
  try {
    console.log('Fetching products from Supabase...')
    
    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('priority', { ascending: true })

    if (productsError) throw productsError

    // Transform products data
    const transformedProducts = products.map(item => ({
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
      size_multipliers: item.size_multipliers || {},
      is_eco: item.is_eco || false,
      badges: item.badges || [],
      category: item.type,
      is_popular: item.is_popular || false,
      material: item.material,
      color_images: item.color_images || {},
      size_images: item.size_images || {},
      additional_images: item.additional_images || [],
      main_color: item.main_color || null,
      seo_title: item.seo_title || null,
      seo_description: item.seo_description || null,
      seo_keywords: item.seo_keywords || null,
      model: item.model || null,
      priority: item.priority || 50,
    }))

    // Fetch SEO metadata
    const { data: seoData, error: seoError } = await supabase
      .from('seo_metadata')
      .select('*')

    if (seoError) throw seoError

    // Fetch website content
    const { data: contentData, error: contentError } = await supabase
      .from('website_content')
      .select('*')

    if (contentError) throw contentError

    const contentObj = {}
    contentData.forEach(item => {
      contentObj[item.key] = item.value || item.link
    })

    // Create data directory
    fs.mkdirSync('src/data', { recursive: true })

    // Write files
    fs.writeFileSync('src/data/products.json', JSON.stringify(transformedProducts, null, 2))
    fs.writeFileSync('src/data/seo.json', JSON.stringify(seoData, null, 2))
    fs.writeFileSync('src/data/content.json', JSON.stringify(contentObj, null, 2))

    console.log(`✓ Fetched ${transformedProducts.length} products`)
    console.log(`✓ Fetched ${seoData.length} SEO entries`)
    console.log(`✓ Fetched ${Object.keys(contentObj).length} content entries`)
  } catch (error) {
    console.error('Error fetching data:', error)
    process.exit(1)
  }
}

fetchData()