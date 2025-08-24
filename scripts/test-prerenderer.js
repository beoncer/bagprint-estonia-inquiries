import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const Prerenderer = require('@prerenderer/prerenderer');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');

console.log('Prerenderer type:', typeof Prerenderer);
console.log('PuppeteerRenderer type:', typeof PuppeteerRenderer);

try {
  const prerenderer = new Prerenderer({
    staticDir: './dist',
    outputDir: './dist-prerendered',
    routes: ['/'],
    renderer: new PuppeteerRenderer({
      renderAfterTime: 5000,
      headless: true
    })
  });
  
  console.log('Prerenderer instance created successfully');
  console.log('Options:', prerenderer.getOptions());
  
} catch (error) {
  console.error('Error creating Prerenderer:', error);
}
