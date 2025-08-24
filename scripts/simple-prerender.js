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
    description: 'Tutvu meie ettevõttega ja saada teada, miks valida Leatex kvaliteetsete kottide ja pakendite jaoks.'
  },
  '/portfoolio': {
    title: 'Portfoolio - Leatex Tööde Näited',
    description: 'Vaata meie portfooliot ja näe, milliseid kvaliteetseid kotte ja pakendeid oleme valmistanud.'
  },
  '/blogi': {
    title: 'Blogi - Leatex Kotid ja Pakendid',
    description: 'Loe meie blogist kasulikke artikleid kottide ja pakendite kohta, keskkonnasõbralikest lahendustest ja palju muust.'
  },
  '/privaatsus': {
    title: 'Privaatsus - Leatex Kotid ja Pakendid',
    description: 'Leatex privaatsuspoliitika ja andmete kaitse tingimused.'
  },
  '/ostutingimused': {
    title: 'Ostutingimused - Leatex Kotid ja Pakendid',
    description: 'Leatex ostutingimused ja teenuse kasutamise reeglid.'
  },
  '/tooted': {
    title: 'Tooted - Leatex Kotid ja Pakendid',
    description: 'Vaata meie laia valikut kvaliteetseid kotte ja pakendeid erinevatele vajadustele.'
  },
  '/riidest-kotid': {
    title: 'Riidest Kotid - Kvaliteetsed Puuvillakotid',
    description: 'Kvaliteetsed puuvillakotid erinevates suurustes ja värvides. Ideaalne kauplustele ja ettevõtetele.'
  },
  '/paberkotid': {
    title: 'Paberkotid - Keskkonnasõbralikud Pakendid',
    description: 'Keskkonnasõbralikud paberkotid erinevates suurustes ja disainides. Taaskasutatavad ja biolagunevad.'
  },
  '/nooriga-kotid': {
    title: 'Nööriga Kotid - Mugavad Seljakotid',
    description: 'Mugavad nööriga kotid erinevates suurustes ja materjalides. Ideaalne kauplustele ja kliendidele.'
  },
  '/sussikotid': {
    title: 'Sussikotid - Jalanõude Hoiustamine',
    description: 'Kvaliteetsed sussikotid jalanõude hoiustamiseks. Erinevates suurustes ja materjalides.'
  },
  '/e-poe-pakendid': {
    title: 'E-poe Pakendid - Leatex Kotid ja Pakendid',
    description: 'Spetsiaalsed pakendid e-poodide jaoks. Turvalised ja esteetilised lahendused.'
  }
};

async function simplePrerender() {
  try {
    console.log('🎭 Starting simple pre-rendering process...');
    
    // Check if we're running on Vercel
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
    
    if (isVercel) {
      console.log('🚀 Detected Vercel environment - using fallback pre-rendering...');
      await fallbackPrerender();
      return;
    }
    
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

    // Set up paths
    const staticDir = path.join(__dirname, '../dist');
    const outputDir = path.join(__dirname, '../dist-prerendered');
    
    console.log(`📁 Static directory: ${staticDir}`);
    console.log(`📁 Output directory: ${outputDir}`);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Try to launch browser with different options
    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
      });
    } catch (error) {
      console.log('⚠️  Failed to launch browser, trying alternative approach...');
      try {
        browser = await puppeteer.launch({ 
          headless: true, 
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
          executablePath: process.env.CHROME_BIN || undefined
        });
      } catch (secondError) {
        console.log('❌ Browser launch failed completely, using fallback...');
        await fallbackPrerender();
        return;
      }
    }

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // Start a simple HTTP server to serve the static files
    const http = await import('http');
    const serveStatic = await import('serve-static');
    
    const serve = serveStatic.default(staticDir);
    const server = http.createServer((req, res) => {
      serve(req, res, () => {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      });
    });
    
    const port = Math.floor(Math.random() * 10000) + 50000;
    server.listen(port, '127.0.0.1');
    
    server.on('listening', async () => {
      const actualPort = server.address().port;
      console.log(`🌐 Server started on port ${actualPort}`);
      
      try {
        for (const route of routes) {
          try {
            console.log(`🔄 Rendering: ${route}`);
            
            const url = `http://127.0.0.1:${actualPort}${route}`;
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Wait for React to hydrate
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
            
            // Inject SEO data if available
            if (seoData[route]) {
              console.log(`🔧 Injecting SEO for ${route}: ${seoData[route].title}`);
              await page.evaluate((seo) => {
                if (document.title !== seo.title) {
                  document.title = seo.title;
                }
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                  metaDesc = document.createElement('meta');
                  metaDesc.name = 'description';
                  document.head.appendChild(metaDesc);
                }
                metaDesc.content = seo.description;
              }, seoData[route]);
            }
            
            // Get the HTML content
            const html = await page.content();
            
            // Create the output path
            let outputPath;
            if (route === '/') {
              outputPath = path.join(outputDir, 'index', 'index.html');
            } else {
              outputPath = path.join(outputDir, route.slice(1), 'index.html');
            }
            
            // Ensure the directory exists
            const outputDirPath = path.dirname(outputPath);
            if (!fs.existsSync(outputDirPath)) {
              fs.mkdirSync(outputDirPath, { recursive: true });
            }
            
            // Write the HTML file
            fs.writeFileSync(outputPath, html);
            console.log(`✅ Wrote: ${route}/index.html`);
            
          } catch (error) {
            console.error(`❌ Failed to render ${route}:`, error.message);
            
            // Write fallback HTML even if rendering fails
            try {
              let outputPath;
              if (route === '/') {
                outputPath = path.join(outputDir, 'index', 'index.html');
              } else {
                outputPath = path.join(outputDir, route.slice(1), 'index.html');
              }
              
              const outputDirPath = path.dirname(outputPath);
              if (!fs.existsSync(outputDirPath)) {
                fs.mkdirSync(outputDirPath, { recursive: true });
              }
              
              // Create a basic fallback HTML
              const fallbackHtml = `<!DOCTYPE html>
<html lang="et">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seoData[route]?.title || 'Leatex - Kvaliteetsed kotid ja pakendid'}</title>
    <meta name="description" content="${seoData[route]?.description || 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga.'}">
    <script>window.location.href = '/';</script>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>`;
              
              fs.writeFileSync(outputPath, fallbackHtml);
              console.log(`⚠️  Wrote fallback HTML for ${route}`);
            } catch (fallbackError) {
              console.error(`❌ Failed to write fallback HTML for ${route}:`, fallbackError.message);
            }
          }
        }
        
        // Copy assets
        console.log('📁 Copying assets...');
        const assetsDir = path.join(staticDir, 'assets');
        const outputAssetsDir = path.join(outputDir, 'assets');
        
        if (fs.existsSync(assetsDir)) {
          if (!fs.existsSync(outputAssetsDir)) {
            fs.mkdirSync(outputAssetsDir, { recursive: true });
          }
          
          // Copy all files from assets directory
          const copyRecursive = (src, dest) => {
            if (fs.statSync(src).isDirectory()) {
              if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
              }
              const files = fs.readdirSync(src);
              files.forEach(file => {
                copyRecursive(path.join(src, file), path.join(dest, file));
              });
            } else {
              fs.copyFileSync(src, dest);
            }
          };
          
          copyRecursive(assetsDir, outputAssetsDir);
          
          // Copy other static files
          const staticFiles = ['favicon.ico', 'manifest.json', 'robots.txt', 'sitemap.xsl', 'sw.js'];
          staticFiles.forEach(file => {
            const srcPath = path.join(staticDir, file);
            const destPath = path.join(outputDir, file);
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, destPath);
            }
          });
          
          // Copy favicon and icon files
          const iconFiles = ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-base.png', 'icon-192x192.png', 'icon-512x512.png'];
          iconFiles.forEach(file => {
            const srcPath = path.join(staticDir, file);
            const destPath = path.join(outputDir, file);
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, destPath);
            }
          });
          
          // Copy lovable-uploads directory if it exists
          const lovableDir = path.join(staticDir, 'lovable-uploads');
          if (fs.existsSync(lovableDir)) {
            const destLovableDir = path.join(outputDir, 'lovable-uploads');
            copyRecursive(lovableDir, destLovableDir);
          }
          
          console.log('✅ Assets copied successfully');
        }
        
        console.log('🎉 Pre-rendering completed successfully!');
        console.log(`📁 Output directory: ${outputDir}`);
        console.log('🚀 You can now deploy the dist-prerendered folder');
        
      } catch (error) {
        console.error('❌ Error during pre-rendering:', error.message);
      } finally {
        await browser.close();
        server.close();
      }
    });
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    // Try fallback as last resort
    await fallbackPrerender();
  }
}

async function fallbackPrerender() {
  console.log('🔄 Using fallback pre-rendering method...');
  
  try {
    // Load routes
    const routesFile = path.join(__dirname, '../src/routes.json');
    let routes = [];
    
    if (fs.existsSync(routesFile)) {
      routes = JSON.parse(fs.readFileSync(routesFile, 'utf8'));
    } else {
      routes = ['/', '/kontakt', '/meist', '/portfoolio', '/blogi', '/privaatsus', '/ostutingimused', '/tooted'];
    }
    
    const outputDir = path.join(__dirname, '../dist-prerendered');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create basic HTML files with SEO data
    for (const route of routes) {
      const seo = seoData[route] || {
        title: 'Leatex - Kvaliteetsed kotid ja pakendid',
        description: 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga.'
      };
      
      let outputPath;
      if (route === '/') {
        outputPath = path.join(outputDir, 'index', 'index.html');
      } else {
        outputPath = path.join(outputDir, route.slice(1), 'index.html');
      }
      
      const outputDirPath = path.dirname(outputPath);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }
      
      const html = `<!DOCTYPE html>
<html lang="et">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://leatex.ee${route}">
    <script>window.location.href = '${route}';</script>
</head>
<body>
    <div id="root">
        <h1>${seo.title}</h1>
        <p>${seo.description}</p>
        <p>Redirecting to main site...</p>
    </div>
</body>
</html>`;
      
      fs.writeFileSync(outputPath, html);
      console.log(`✅ Created fallback HTML for ${route}`);
    }
    
    console.log('🎉 Fallback pre-rendering completed!');
    
  } catch (error) {
    console.error('❌ Fallback pre-rendering failed:', error.message);
    throw error;
  }
}

simplePrerender();
