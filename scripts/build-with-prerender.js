import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('📋 Step 1: Generating routes...');
  execSync('node scripts/generate-routes.js', { stdio: 'inherit' });

  // Fallback routes if routes.json is not found
  const routesFile = path.join(__dirname, '../src/routes.json');
  if (!fs.existsSync(routesFile)) {
    console.log('⚠️  routes.json not found, creating fallback routes');
    const fallbackRoutes = [
      '/',
      '/kontakt',
      '/meist',
      '/portfoolio',
      '/blogi',
      '/privaatsus',
      '/ostutingimused',
      '/tooted'
    ];
    fs.writeFileSync(routesFile, JSON.stringify(fallbackRoutes, null, 2));
  }

  console.log('🔨 Step 2: Building project with Vite...');
  execSync('vite build', { stdio: 'inherit' });

  console.log('🎭 Step 3: Running Vercel-compatible pre-rendering...');
  execSync('node scripts/vercel-prerender.js', { stdio: 'inherit' });

  console.log('✅ Build with Vercel pre-rendering completed successfully!');
  console.log('📁 Check the dist-prerendered/ folder for your pre-rendered HTML files');
  console.log('🚀 Deploy the dist-prerendered/ folder for production');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
