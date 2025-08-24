import puppeteer from 'puppeteer';
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
    description: 'Tutvu meie ettevõttega ja meie missiooniga pakkuda kvaliteetseid kotte ja pakendeid. Aastatepikkune kogemus.'
  },
  '/portfoolio': {
    title: 'Portfoolio - Leatex Tööde Näited',
    description: 'Vaata meie portfooliot ja näe, milliseid kvaliteetseid kotte ja pakendeid oleme valmistanud meie klientidele.'
  },
  '/blogi': {
    title: 'Blogi - Leatex Kotid ja Pakendid',
    description: 'Loe meie blogist kasulikke artikleid kottide ja pakendite kohta, trendidest ja uutest toodetest.'
  },
  '/privaatsus': {
    title: 'Privaatsus - Leatex Kotid ja Pakendid',
    description: 'Meie privaatsuspoliitika ja andmete kaitse tingimused.'
  },
  '/ostutingimused': {
    title: 'Ostutingimused - Leatex Kotid ja Pakendid',
    description: 'Ostutingimused ja kohustused kvaliteetsete kottide ja pakendite ostmisel.'
  },
  '/tooted': {
    title: 'Tooted - Leatex Kotid ja Pakendid',
    description: 'Vaata meie kvaliteetsete kottide ja pakendite valikut. Puuvillakotid, paberkotid, nööriga kotid ja sussikotid.'
  },
  '/riidest-kotid': {
    title: 'Riidest Kotid - Kvaliteetsed Puuvillakotid',
    description: 'Kvaliteetsed riidest kotid ja puuvillakotid erinevates suurustes ja värvides. Kohandatud trükk ja personaliseerimine.'
  },
  '/paberkotid': {
    title: 'Paberkotid - Keskkonnasõbralikud Pakendid',
    description: 'Keskkonnasõbralikud paberkotid teie brändile. Taaskasutatud materjal, vastupidav ja ökoloogiline.'
  },
  '/nooriga-kotid': {
    title: 'Nööriga Kotid - Mugavad Seljakotid',
    description: 'Mugavad nööriga kotid spordivahenditele ja väikestele esemetele. Reguleeritavad nöörid ja erinevad materjalid.'
  },
  '/sussikotid': {
    title: 'Sussikotid - Jalanõude Hoiustamine',
    description: 'Hingavad sussikotid jalanõude hoiustamiseks ja transportimiseks. Erinevad suurused ja hingavad materjalid.'
  },
  '/e-poe-pakendid': {
    title: 'E-poe Pakendid - Leatex Kotid ja Pakendid',
    description: 'Spetsiaalsed pakendid e-kaubanduse jaoks. Turvalised ja professionaalsed lahendused.'
  }
};

async function simplePrerender() {
  try {
    console.log('🎭 Starting simple pre-rendering process...');
    
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
        '/tooted',
        '/riidest-kotid',
        '/paberkotid',
        '/nooriga-kotid',
        '/sussikotid',
        '/e-poe-pakendid'
      ];
    }
    
    // Use absolute paths
    const staticDir = path.resolve(__dirname, '../dist');
    const outputDir = path.resolve(__dirname, '../dist-prerendered');
    
    console.log('📁 Static directory:', staticDir);
    console.log('📁 Output directory:', outputDir);
    
    // Start a local server to serve the built files
    const http = await import('http');
    const serveStatic = await import('serve-static');
    
    const serve = serveStatic.default(staticDir);
    const server = http.createServer((req, res) => {
      // Handle React Router - serve index.html for all routes
      if (req.url && !req.url.includes('.') && req.url !== '/') {
        // For routes like /kontakt, /meist, etc., serve index.html
        const indexPath = path.join(staticDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf8');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
          return;
        }
      }
      
      // Serve static files normally
      serve(req, res, () => {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      });
    });
    
    // Start server on a random port
    const port = 0;
    server.listen(port, '127.0.0.1');
    
    server.on('listening', async () => {
      const actualPort = server.address().port;
      console.log(`🌐 Server started on port ${actualPort}`);
      
      // Launch browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({ width: 1200, height: 800 });
      
      // Process each route
      for (const route of routes) {
        try {
          console.log(`🔄 Rendering: ${route}`);
          
          const url = `http://127.0.0.1:${actualPort}${route}`;
          
          // Navigate to the page
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
          
          // Wait for React to hydrate and render
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Wait for the root element to be populated with content
          await page.waitForFunction(() => {
            const root = document.querySelector('#root');
            if (!root) return false;
            
            // Check if there's actual content (not just loading)
            const hasContent = root.innerHTML.length > 100;
            const hasText = root.textContent && root.textContent.trim().length > 50;
            
            return hasContent && hasText;
          }, { timeout: 15000 });
          
          // Additional wait to ensure all dynamic content is loaded
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Get the rendered HTML
          let html = await page.content();
          
          // Inject correct SEO data for static routes
          if (seoData[route]) {
            const seo = seoData[route];
            console.log(`🔧 Injecting SEO for ${route}: ${seo.title}`);
            
            // Replace title
            html = html.replace(
              /<title>.*?<\/title>/,
              `<title>${seo.title}</title>`
            );
            
            // Replace meta description
            html = html.replace(
              /<meta name="description" content=".*?"/g,
              `<meta name="description" content="${seo.description}"`
            );
            
            // Replace Open Graph title
            html = html.replace(
              /<meta property="og:title" content=".*?"/g,
              `<meta property="og:title" content="${seo.title}"`
            );
            
            // Replace Open Graph description
            html = html.replace(
              /<meta property="og:description" content=".*?"/g,
              `<meta property="og:description" content="${seo.description}"`
            );
            
            // Replace Twitter title
            html = html.replace(
              /<meta name="twitter:title" content=".*?"/g,
              `<meta name="twitter:title" content="${seo.title}"`
            );
            
            // Replace Twitter description
            html = html.replace(
              /<meta name="twitter:description" content=".*?"/g,
              `<meta name="twitter:description" content="${seo.description}"`
            );
          }
          
          // Create output path
          const routePath = route === '/' ? '/index' : route;
          const outputPath = path.join(outputDir, routePath, 'index.html');
          
          // Ensure directory exists
          const dir = path.dirname(outputPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Write the HTML file
          fs.writeFileSync(outputPath, html);
          console.log(`✅ Wrote: ${routePath}/index.html`);
          
        } catch (error) {
          console.error(`❌ Failed to render ${route}:`, error.message);
          
          // Try to get the HTML anyway, even if it failed
          try {
            let html = await page.content();
            
            // Inject SEO data even for failed routes
            if (seoData[route]) {
              const seo = seoData[route];
              html = html.replace(
                /<title>.*?<\/title>/,
                `<title>${seo.title}</title>`
              );
              html = html.replace(
                /<meta name="description" content=".*?"/g,
                `<meta name="description" content="${seo.description}"`
              );
            }
            
            const routePath = route === '/' ? '/index' : route;
            const outputPath = path.join(outputDir, routePath, 'index.html');
            
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(outputPath, html);
            console.log(`⚠️  Wrote fallback HTML for: ${routePath}/index.html`);
          } catch (fallbackError) {
            console.error(`❌ Failed to write fallback HTML for ${route}:`, fallbackError.message);
          }
        }
      }
      
      // Copy assets from dist to dist-prerendered
      console.log('📁 Copying assets...');
      
      function copyDir(src, dest) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const items = fs.readdirSync(src);
        for (const item of items) {
          const srcPath = path.join(src, item);
          const destPath = path.join(dest, item);
          
          if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else if (!item.endsWith('.html')) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
      
      copyDir(staticDir, outputDir);
      console.log('✅ Assets copied successfully');
      
      // Cleanup
      await browser.close();
      server.close();
      
      console.log('🎉 Pre-rendering completed successfully!');
      console.log(`📁 Output directory: ${outputDir}`);
      console.log('🚀 You can now deploy the dist-prerendered folder');
      
    });
    
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
  }
}

// Run the prerenderer
simplePrerender();
