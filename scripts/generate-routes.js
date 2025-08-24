import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzgxNDU3NSwiZXhwIjoyMDYzMzkwNTc1fQ.2fW1J9z8RQAd3WopZHjQ-rSwaf5exwneU1MfQ_DgJME';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateRoutes() {
  try {
    console.log('🚀 Generating routes for pre-rendering...');
    
    const routes = [
      // Static routes
      '/',
      '/kontakt',
      '/meist', 
      '/portfoolio',
      '/blogi',
      '/privaatsus',
      '/ostutingimused',
      '/tooted',
      '/riidest-kotid',
      '/paberkotid',
      '/nooriga-kotid',
      '/sussikotid',
      '/e-poe-pakendid'
    ];

    // Fetch product routes
    console.log('📦 Fetching product routes...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug')
      .not('slug', 'is', null);

    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else {
      products.forEach(product => {
        if (product.slug) {
          routes.push(`/tooted/${product.slug}`);
        }
      });
      console.log(`✅ Added ${products.length} product routes`);
    }

    // Fetch blog post routes
    console.log('📝 Fetching blog post routes...');
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug')
      .not('slug', 'is', null);

    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
    } else if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach(post => {
        if (post.slug) {
          routes.push(`/blogi/${post.slug}`);
        }
      });
      console.log(`✅ Added ${blogPosts.length} blog post routes`);
    }

    // Write routes to file
    const routesFile = path.join(__dirname, '../src/routes.json');
    fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
    
    console.log(`🎯 Generated ${routes.length} routes for pre-rendering`);
    console.log('📁 Routes saved to:', routesFile);
    
    return routes;
  } catch (error) {
    console.error('❌ Error generating routes:', error);
    process.exit(1);
  }
}

// Run if called directly
generateRoutes();
