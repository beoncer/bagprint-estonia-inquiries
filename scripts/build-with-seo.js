#!/usr/bin/env node

const { exec } = require('child_process');
const { generateSEOPages } = require('./generate-seo-pages');

async function buildWithSEO() {
  try {
    console.log('🏗️  Building project with Vite...');
    
    // Run the standard Vite build
    await new Promise((resolve, reject) => {
      exec('npm run build:vite', (error, stdout, stderr) => {
        if (error) {
          console.error('Build failed:', error);
          reject(error);
          return;
        }
        console.log(stdout);
        if (stderr) console.error(stderr);
        resolve();
      });
    });

    console.log('✅ Vite build completed');
    
    // Generate SEO pages
    console.log('🔍 Generating SEO-optimized pages...');
    await generateSEOPages();
    
    console.log('🎉 Build with SEO completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  buildWithSEO();
}

module.exports = { buildWithSEO };