import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO data mapping for different routes
const seoData = {
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
  }
};

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
        if (seoData[route]) {
          const { title, description } = seoData[route];
          modifiedHtml = baseHtml
            .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
            .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}">`);
        }
        
        // For Vercel, create files with the exact route name
        let fileName = 'index.html';
        if (route !== '/') {
          // Remove leading slash and create filename
          fileName = route.substring(1) + '.html';
        }
        
        // Write the HTML file directly in the output directory
        const htmlPath = path.join(outputDir, fileName);
        fs.writeFileSync(htmlPath, modifiedHtml);
        
        console.log(`✅ Generated: ${fileName}`);
        
      } catch (error) {
        console.error(`❌ Failed to process ${route}:`, error.message);
      }
    }
    
    console.log('🎉 Vercel pre-rendering completed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('💡 Note: Files are now created as route.html (e.g., kontakt.html) for Vercel compatibility');
    
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
