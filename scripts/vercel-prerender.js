import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzgxNDU3NSwiZXhwIjoyMDYzMzkwNTc1fQ.2fW1J9z8RQAd3WopZHjQ-rSwaf5exwneU1MfQ_DgJME';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchAllSeoData() {
  try {
    console.log('📊 Fetching ALL SEO data from Supabase...');
    
    // Fetch main page SEO data from seo_metadata table
    const { data: seoMetadata, error: seoError } = await supabase
      .from('seo_metadata')
      .select('*');
    
    if (seoError) {
      console.error('❌ Error fetching SEO metadata:', seoError);
    }
    
    // Fetch product SEO data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, name, description')
      .not('slug', 'is', null);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    }
    
    // Fetch blog post SEO data
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt')
      .not('slug', 'is', null);
    
    if (blogError) {
      console.error('❌ Error fetching blog posts:', blogError);
    }
    
    // Create unified SEO data structure
    const allSeoData = {};
    
    // Map main pages to their SEO data
    if (seoMetadata) {
      seoMetadata.forEach(seo => {
        // Use EXACTLY the same mapping as DynamicSEO component
        const routeMapping = {
          'home': '/',
          'products': '/tooted',
          'cotton-bags': '/riidest-kotid',
          'paper-bags': '/paberkotid',
          'drawstring-bags': '/nooriga-kotid',
          'shoebags': '/sussikotid',
          'contact': '/kontakt',
          'about': '/meist',
          'portfolio': '/portfoolio',
          'blog': '/blogi',
          'admin': '/admin'
        };
        
        const route = routeMapping[seo.page];
        if (route && seo.title && seo.description) {
          allSeoData[route] = {
            title: seo.title,
            description: seo.description
          };
          console.log(`  📝 Mapped ${seo.page} -> ${route}: "${seo.title}"`);
        }
      });
    }
    
    // Add product routes
    if (products) {
      products.forEach(product => {
        if (product.slug) {
          const route = `/tooted/${product.slug}`;
          allSeoData[route] = {
            title: `${product.name} - Leatex`,
            description: product.description || `Kvaliteetne ${product.name} kohandatud trükiga. Leatex kvaliteet ja usaldusväärsus.`
          };
        }
      });
    }
    
    // Add blog post routes
    if (blogPosts) {
      blogPosts.forEach(post => {
        if (post.slug) {
          const route = `/blogi/${post.slug}`;
          allSeoData[route] = {
            title: `${post.title} - Leatex Blogi`,
            description: post.excerpt || `Loe meie blogist artiklit "${post.title}". Kasulikud nõuanded ja teadmised.`
          };
        }
      });
    }
    
    // Add category pages with SEO from seo_metadata
    const categoryPages = [
      '/riidest-kotid',
      '/paberkotid', 
      '/nooriga-kotid',
      '/sussikotid',
      '/e-poe-pakendid'
    ];
    
    categoryPages.forEach(category => {
      if (!allSeoData[category]) {
        // Fallback SEO for category pages if not in seo_metadata
        const categoryNames = {
          '/riidest-kotid': 'Riidest kotid',
          '/paberkotid': 'Paberkotid',
          '/nooriga-kotid': 'Nooriga kotid',
          '/sussikotid': 'Sussikotid',
          '/e-poe-pakendid': 'E-poe pakendid'
        };
        
        allSeoData[category] = {
          title: `${categoryNames[category]} - Leatex Kotid ja Pakendid`,
          description: `Kvaliteetsed ${categoryNames[category].toLowerCase()} kohandatud trükiga. Leatex kvaliteet ja usaldusväärsus.`
        };
      }
    });
    
    // Add other main pages with fallback SEO if not in seo_metadata
    const mainPages = [
      '/kontakt',
      '/meist',
      '/portfoolio',
      '/blogi',
      '/privaatsus',
      '/ostutingimused'
    ];
    
    mainPages.forEach(page => {
      if (!allSeoData[page]) {
        const pageNames = {
          '/kontakt': 'Kontakt',
          '/meist': 'Meist',
          '/portfoolio': 'Portfoolio',
          '/blogi': 'Blogi',
          '/privaatsus': 'Privaatsuspoliitika',
          '/ostutingimused': 'Ostutingimused'
        };
        
        allSeoData[page] = {
          title: `${pageNames[page]} - Leatex Kotid ja Pakendid`,
          description: `Leatex ${pageNames[page].toLowerCase()} leht. Kvaliteetsed kotid ja pakendid kohandatud trükiga.`
        };
      }
    });
    
    console.log(`✅ Fetched SEO data for ${Object.keys(allSeoData).length} routes from Supabase`);
    return allSeoData;
    
  } catch (error) {
    console.error('❌ Error fetching SEO data:', error);
    return {};
  }
}

async function vercelPrerender() {
  try {
    console.log('🎭 Starting Vercel-compatible pre-rendering...');

    // Load routes from the generated file
    const routesFile = path.join(__dirname, '../src/routes.json');
    let routes = [];

    if (fs.existsSync(routesFile)) {
      routes = JSON.parse(fs.readFileSync(routesFile, 'utf8'));
      console.log(`📋 Loaded ${routes.length} routes for pre-rendering`);
    } else {
      console.log('⚠️  routes.json not found, using default routes');
      routes = [
        '/',
        '/kontakt',
        '/meist',
        '/portfoolio',
        '/blogi',
        '/privaatsus',
        '/ostutingimused',
        '/tooted'
      ];
    }

    // Fetch ALL SEO data from Supabase
    const allSeoData = await fetchAllSeoData();
    
    // Create output directory
    const outputDir = path.join(__dirname, '../dist-prerendered');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Copy the built Vite app first
    const distDir = path.join(__dirname, '../dist');
    if (fs.existsSync(distDir)) {
      console.log('📁 Copying built Vite app...');
      copyDirectory(distDir, outputDir);
    }

    // Generate HTML files for each route
    console.log('🔄 Generating HTML files for each route...');

    for (const route of routes) {
      try {
        console.log(`📝 Processing route: ${route}`);

        // Get the base HTML template
        const baseHtmlPath = path.join(outputDir, 'index.html');
        let baseHtml = '';

        if (fs.existsSync(baseHtmlPath)) {
          baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
        } else {
          // Fallback HTML template if index.html doesn't exist
          baseHtml = `<!DOCTYPE html>
<html lang="et">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leatex - Kvaliteetsed kotid ja pakendid</title>
    <meta name="description" content="Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga.">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/main.js"></script>
</body>
</html>`;
        }

        // Inject SEO data from Supabase
        let modifiedHtml = baseHtml;
        if (allSeoData[route]) {
          const { title, description } = allSeoData[route];
          
          // Replace title tag
          modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          
          // Replace meta description
          modifiedHtml = modifiedHtml.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`);
          
          // Replace Open Graph tags - more precise regex
          modifiedHtml = modifiedHtml.replace(
            /<meta property="og:title"[^>]*content="[^"]*"[^>]*>/,
            `<meta property="og:title" content="${title}" />`
          );
          modifiedHtml = modifiedHtml.replace(
            /<meta property="og:description"[^>]*content="[^"]*"[^>]*>/,
            `<meta property="og:description" content="${description}" />`
          );
          
          // Replace Twitter tags - more precise regex
          modifiedHtml = modifiedHtml.replace(
            /<meta name="twitter:title"[^>]*content="[^"]*"[^>]*>/,
            `<meta name="twitter:title" content="${title}" />`
          );
          modifiedHtml = modifiedHtml.replace(
            /<meta name="twitter:description"[^>]*content="[^"]*"[^>]*>/,
            `<meta name="twitter:description" content="${description}" />`
          );
          
          // Update canonical URL for each route
          const canonicalUrl = `https://leatex.ee${route}`;
          modifiedHtml = modifiedHtml.replace(
            /<link rel="canonical"[^>]*href="[^"]*"[^>]*>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          );
          
          console.log(`  📝 SEO: "${title}"`);
          console.log(`  📝 Description: "${description}"`);
        } else {
          console.log(`  ⚠️  No SEO data found for ${route}`);
        }

        // Create route directory structure and write index.html
        if (route === '/') {
          const htmlPath = path.join(outputDir, 'index.html');
          fs.writeFileSync(htmlPath, modifiedHtml);
          console.log(`✅ Generated: index.html`);
        } else {
          const routeDir = path.join(outputDir, route);
          if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
          }
          const htmlPath = path.join(routeDir, 'index.html');
          fs.writeFileSync(htmlPath, modifiedHtml);
          console.log(`✅ Generated: ${route}/index.html`);
          
          // Remove any flat .html file if it exists (cleanup)
          const flatHtmlPath = path.join(outputDir, `${route}.html`);
          if (fs.existsSync(flatHtmlPath)) {
            fs.unlinkSync(flatHtmlPath);
            console.log(`  🧹 Cleaned up flat file: ${route}.html`);
          }
        }

      } catch (error) {
        console.error(`❌ Failed to process ${route}:`, error.message);
      }
    }

    console.log('🎉 Vercel pre-rendering completed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('💡 All pages now use SEO data from Supabase database');

  } catch (error) {
    console.error('❌ Vercel pre-rendering failed:', error);
    process.exit(1);
  }
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

vercelPrerender();
