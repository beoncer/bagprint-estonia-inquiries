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

// Static SEO data for main pages
const staticSeoData = {
  '/': {
    title: 'Leatex - Kvaliteetsed kotid ja pakendid',
    description: 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Küsi pakkumist juba täna!'
  },
  '/kontakt': {
    title: 'Kontakt - Leatex Kotid ja Pakendid',
    description: 'Võta meiega ühendust ja küsi pakkumist kvaliteetsetele kottidele ja pakenditele. Kiire vastus ja professionaalne teenus.'
  },
  '/meist': {
    title: 'Meist - Leatex Kotid ja Pakendid',
    description: 'Tutvu meie ettevõttega ja kvaliteetsete kottide tootmisega. Leatex on sinu usaldusväärne partner kottide ja pakendite valdkonnas.'
  },
  '/portfoolio': {
    title: 'Portfoolio - Leatex Kotid ja Pakendid',
    description: 'Vaata meie portfooliot ja näe kvaliteetsete kottide ja pakendite näiteid. Meie tööd räägivad ise enda eest.'
  },
  '/blogi': {
    title: 'Blogi - Leatex Kotid ja Pakendid',
    description: 'Loe meie blogist kasulikke artikleid kottide ja pakendite kohta. Nõuanded, trendid ja uudised.'
  },
  '/privaatsus': {
    title: 'Privaatsuspoliitika - Leatex',
    description: 'Leatex privaatsuspoliitika ja andmete kaitse. Loe, kuidas kaitstakse sinu isiklikke andmeid.'
  },
  '/ostutingimused': {
    title: 'Ostutingimused - Leatex',
    description: 'Leatex ostutingimused ja teenuse kasutamise reeglid. Tutvu meie teenuse tingimustega.'
  },
  '/tooted': {
    title: 'Tooted - Leatex Kotid ja Pakendid',
    description: 'Vaata meie kvaliteetsete kottide ja pakendite valikut. Puuvillakotid, paberkotid, paelaga kotid ja palju muud.'
  },
  '/riidest-kotid': {
    title: 'Riidest kotid - Leatex Kotid ja Pakendid',
    description: 'Kvaliteetsed riidest kotid erinevates värvides ja suurustes. Kohandatud trükk ja kiire tootmine.'
  },
  '/paberkotid': {
    title: 'Paberkotid - Leatex Kotid ja Pakendid',
    description: 'Keskkonnasõbralikud paberkotid kohandatud trükiga. Ideaalne turustamiseks ja reklaamiks.'
  },
  '/nooriga-kotid': {
    title: 'Nooriga kotid - Leatex Kotid ja Pakendid',
    description: 'Praktilised nooriga kotid erinevates stiilides. Kohandatud trükk ja kõrge kvaliteet.'
  },
  '/sussikotid': {
    title: 'Sussikotid - Leatex Kotid ja Pakendid',
    description: 'Elegantsed sussikotid kohandatud trükiga. Ideaalne kingade ja jalatiste pakendamiseks.'
  },
  '/e-poe-pakendid': {
    title: 'E-poe pakendid - Leatex Kotid ja Pakendid',
    description: 'Professionaalsed e-poe pakendid kohandatud trükiga. Turustamiseks ja brändimiseks.'
  }
};

async function fetchDynamicSeoData() {
  try {
    console.log('📊 Fetching dynamic SEO data from Supabase...');
    
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
    
    // Create dynamic SEO data
    const dynamicSeoData = {};
    
    // Add product routes
    if (products) {
      products.forEach(product => {
        if (product.slug) {
          const route = `/tooted/${product.slug}`;
          dynamicSeoData[route] = {
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
          dynamicSeoData[route] = {
            title: `${post.title} - Leatex Blogi`,
            description: post.excerpt || `Loe meie blogist artiklit "${post.title}". Kasulikud nõuanded ja teadmised.`
          };
        }
      });
    }
    
    console.log(`✅ Fetched ${Object.keys(dynamicSeoData).length} dynamic routes`);
    return dynamicSeoData;
    
  } catch (error) {
    console.error('❌ Error fetching dynamic SEO data:', error);
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

    // Fetch dynamic SEO data
    const dynamicSeoData = await fetchDynamicSeoData();
    
    // Merge static and dynamic SEO data
    const allSeoData = { ...staticSeoData, ...dynamicSeoData };

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

        // Inject SEO data based on route
        let modifiedHtml = baseHtml;
        if (allSeoData[route]) {
          const { title, description } = allSeoData[route];
          modifiedHtml = baseHtml
            .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
            .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}">`);
        }

        // Create route directory structure
        const routeDir = path.join(outputDir, route === '/' ? '' : route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }

        // Write the HTML file
        const htmlPath = path.join(routeDir, 'index.html');
        fs.writeFileSync(htmlPath, modifiedHtml);

        console.log(`✅ Generated: ${route}/index.html`);

      } catch (error) {
        console.error(`❌ Failed to process ${route}:`, error.message);
      }
    }

    console.log('🎉 Vercel pre-rendering completed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);

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
