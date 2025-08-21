#!/usr/bin/env node

/**
 * Post-build script to generate SEO-optimized HTML files
 * Run this after 'npm run build' to add SEO optimization
 * 
 * Usage:
 * npm run build && node scripts/postbuild.js
 */

const { generateSEOPages } = require('./generate-seo-pages');

console.log('🔍 Post-build SEO optimization starting...');
generateSEOPages()
  .then(() => {
    console.log('✅ Post-build SEO optimization completed!');
    console.log('');
    console.log('🎯 Your site now has:');
    console.log('   • Proper meta tags in "View Page Source"');
    console.log('   • SEO-optimized product pages');
    console.log('   • Social media friendly Open Graph tags');
    console.log('   • Structured data for search engines');
    console.log('');
    console.log('📝 To deploy with SEO: npm run build && node scripts/postbuild.js');
  })
  .catch(error => {
    console.error('❌ Post-build SEO optimization failed:', error);
    process.exit(1);
  });