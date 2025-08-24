import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import using require for CommonJS packages
const { Prerenderer } = require('@prerenderer/prerenderer');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');

async function prerender() {
  try {
    console.log('🎭 Starting pre-rendering process...');
    
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
    
    // Create prerenderer instance
    const prerenderer = new Prerenderer({
      staticDir: staticDir,
      outputDir: outputDir,
      routes: routes,
      renderer: new PuppeteerRenderer({
        renderAfterTime: 5000,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    });
    
    // Start the prerenderer
    console.log('🚀 Initializing prerenderer...');
    await prerenderer.initialize();
    
    // Render all routes
    console.log('🔄 Rendering routes...');
    const renderedRoutes = await prerenderer.renderRoutes();
    
    console.log(`✅ Successfully pre-rendered ${renderedRoutes.length} routes`);
    
    // Process each rendered route
    for (const route of renderedRoutes) {
      if (route.html) {
        const routePath = route.route === '/' ? '/index' : route.route;
        const outputPath = path.join(outputDir, routePath, 'index.html');
        
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write the HTML file
        fs.writeFileSync(outputPath, route.html);
        console.log(`📄 Wrote: ${routePath}/index.html`);
      }
    }
    
    // Copy assets from dist to dist-prerendered
    console.log('📁 Copying assets...');
    
    // Copy all files except HTML files
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
    
    await prerenderer.destroy();
    
    console.log('🎉 Pre-rendering completed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('🚀 You can now deploy the dist-prerendered folder');
    
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
  }
}

// Run the prerenderer
prerender();
