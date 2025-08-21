#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://ixotpxliaerkzjznyipi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// HTML template function
function createHTML({ title, description, keywords, url, canonicalUrl, structuredData }) {
  return `<!doctype html>
<html lang="et">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>${title || 'Leatex - Kvaliteetsed kotid trükiga'}</title>
    <meta name="description" content="${description || 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Kiire tarne ja suurepärane kvaliteet.'}" />
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="${title || 'Leatex - Kvaliteetsed kotid trükiga'}" />
    <meta property="og:description" content="${description || 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Kiire tarne ja suurepärane kvaliteet.'}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="https://leatex.ee/og-image.jpg" />
    <meta property="og:site_name" content="Leatex" />
    <meta property="og:locale" content="et_EE" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title || 'Leatex - Kvaliteetsed kotid trükiga'}" />
    <meta name="twitter:description" content="${description || 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Kiire tarne ja suurepärane kvaliteet.'}" />
    <meta name="twitter:image" content="https://leatex.ee/og-image.jpg" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Structured Data -->
    ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>` : ''}
    
    <!-- Preload critical resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Progressive Web App -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#dc2626">
    
    <!-- Additional meta tags for better crawling -->
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="bingbot" content="index, follow" />
    
    <!-- Stylesheets will be injected by Vite -->
    <script type="module" crossorigin src="/assets/index.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Generate structured data for different page types
function generateStructuredData(pageType, data = {}) {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Leatex",
    "url": "https://leatex.ee",
    "logo": "https://leatex.ee/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+372 5555 5555",
      "contactType": "customer service",
      "availableLanguage": "Estonian"
    },
    "sameAs": [
      "https://www.facebook.com/leatexee",
      "https://www.instagram.com/leatexee"
    ]
  };

  switch (pageType) {
    case 'home':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Leatex",
        "url": "https://leatex.ee",
        "description": "Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga",
        "publisher": baseOrganization,
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://leatex.ee/tooted?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
    
    case 'product':
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data.name || "Kvaliteetne kott",
        "description": data.description || "Kvaliteetne kott kohandatud trükiga",
        "image": data.image_url || "https://leatex.ee/default-product.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Leatex"
        },
        "manufacturer": baseOrganization,
        "category": data.type || "Kotid",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "seller": baseOrganization
        }
      };
    
    case 'blog':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.excerpt,
        "image": data.image_url,
        "author": {
          "@type": "Organization",
          "name": "Leatex"
        },
        "publisher": baseOrganization,
        "datePublished": data.created_at,
        "dateModified": data.updated_at || data.created_at
      };
    
    default:
      return baseOrganization;
  }
}

// Main generation function
async function generateSEOPages() {
  try {
    console.log('🚀 Starting SEO page generation...');

    // Create dist directory if it doesn't exist
    const distDir = path.join(process.cwd(), 'dist');
    await fs.mkdir(distDir, { recursive: true });

    // Fetch SEO metadata
    const { data: seoData, error: seoError } = await supabase
      .from('seo_metadata')
      .select('*');

    if (seoError) {
      console.error('Error fetching SEO data:', seoError);
      return;
    }

    console.log(`📄 Found ${seoData.length} SEO entries`);

    // Generate pages based on SEO metadata
    const pageRoutes = {
      'home': '/',
      'products': '/tooted',
      'cotton-bags': '/riidest-kotid',
      'paper-bags': '/paberkotid',
      'drawstring-bags': '/nooriga-kotid',
      'shoebags': '/sussikotid',
      'contact': '/kontakt',
      'about': '/meist',
      'portfolio': '/portfoolio',
      'blog': '/blogi'
    };

    // Generate HTML files for each page with SEO data
    for (const seoEntry of seoData) {
      const route = pageRoutes[seoEntry.page];
      if (!route) continue;

      const canonicalUrl = `https://leatex.ee${route}`;
      const structuredData = generateStructuredData(seoEntry.page === 'home' ? 'home' : 'page');

      const html = createHTML({
        title: seoEntry.title,
        description: seoEntry.description,
        keywords: seoEntry.keywords,
        url: route,
        canonicalUrl,
        structuredData
      });

      // Create directory structure if needed
      if (route !== '/') {
        const routeDir = path.join(distDir, route.slice(1));
        await fs.mkdir(routeDir, { recursive: true });
        await fs.writeFile(path.join(routeDir, 'index.html'), html);
      } else {
        // Keep the main index.html as fallback, create seo-index.html for home
        await fs.writeFile(path.join(distDir, 'seo-index.html'), html);
      }

      console.log(`✅ Generated SEO page: ${route}`);
    }

    // Generate product pages
    await generateProductPages(distDir);

    // Generate blog pages
    await generateBlogPages(distDir);

    console.log('🎉 SEO page generation completed!');

  } catch (error) {
    console.error('❌ Error generating SEO pages:', error);
    process.exit(1);
  }
}

// Generate product-specific pages
async function generateProductPages(distDir) {
  console.log('🛍️ Generating product pages...');

  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  for (const product of products) {
    if (!product.slug) continue;

    const canonicalUrl = `https://leatex.ee/tooted/${product.slug}`;
    const structuredData = generateStructuredData('product', product);

    const title = product.seo_title || `${product.name} - Leatex`;
    const description = product.seo_description || product.description || `${product.name} - kvaliteetne ${product.type} kohandatud trükiga`;

    const html = createHTML({
      title,
      description,
      keywords: product.seo_keywords,
      url: `/tooted/${product.slug}`,
      canonicalUrl,
      structuredData
    });

    const productDir = path.join(distDir, 'tooted', product.slug);
    await fs.mkdir(productDir, { recursive: true });
    await fs.writeFile(path.join(productDir, 'index.html'), html);

    console.log(`✅ Generated product page: ${product.slug}`);
  }
}

// Generate blog pages
async function generateBlogPages(distDir) {
  console.log('📝 Generating blog pages...');

  const { data: blogPosts, error } = await supabase
    .from('blog_posts')
    .select('*');

  if (error) {
    console.error('Error fetching blog posts:', error);
    return;
  }

  for (const post of blogPosts) {
    if (!post.slug) continue;

    const canonicalUrl = `https://leatex.ee/blogi/${post.slug}`;
    const structuredData = generateStructuredData('blog', post);

    const title = post.seo_title || `${post.title} - Leatex Blogi`;
    const description = post.seo_description || post.excerpt;

    const html = createHTML({
      title,
      description,
      keywords: post.seo_keywords,
      url: `/blogi/${post.slug}`,
      canonicalUrl,
      structuredData
    });

    const blogDir = path.join(distDir, 'blogi', post.slug);
    await fs.mkdir(blogDir, { recursive: true });
    await fs.writeFile(path.join(blogDir, 'index.html'), html);

    console.log(`✅ Generated blog page: ${post.slug}`);
  }
}

// Run the generation
if (require.main === module) {
  generateSEOPages();
}

module.exports = { generateSEOPages };
