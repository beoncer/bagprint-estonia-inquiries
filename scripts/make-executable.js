#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Make scripts executable
const scripts = [
  'scripts/generate-seo-pages.js',
  'scripts/build-with-seo.js'
];

scripts.forEach(script => {
  const scriptPath = path.join(process.cwd(), script);
  try {
    fs.chmodSync(scriptPath, '755');
    console.log(`✅ Made ${script} executable`);
  } catch (error) {
    console.error(`❌ Failed to make ${script} executable:`, error.message);
  }
});

console.log('🎉 Script permissions updated!');