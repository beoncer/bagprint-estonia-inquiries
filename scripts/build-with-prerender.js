import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting build with pre-rendering...');

try {
  // Step 1: Generate routes
  console.log('📋 Step 1: Generating routes...');
  execSync('node scripts/generate-routes.js', { stdio: 'inherit' });
  
  // Step 2: Check if routes.json was created
  const routesFile = path.join(__dirname, '../src/routes.json');
  if (!fs.existsSync(routesFile)) {
    console.log('⚠️  routes.json not found, creating default routes...');
    const defaultRoutes = [
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
    fs.writeFileSync(routesFile, JSON.stringify(defaultRoutes, null, 2));
  }
  
  // Step 3: Build the project with Vite
  console.log('🔨 Step 2: Building project with Vite...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Step 4: Run pre-rendering
  console.log('🎭 Step 3: Running pre-rendering...');
  execSync('node scripts/simple-prerender.js', { stdio: 'inherit' });
  
  console.log('✅ Build with pre-rendering completed successfully!');
  console.log('📁 Check the dist-prerendered/ folder for your pre-rendered HTML files');
  console.log('🚀 Deploy the dist-prerendered/ folder for production');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
