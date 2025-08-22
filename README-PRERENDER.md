# Vite 5 Native Prerender Setup

This implementation creates static HTML files with proper SEO tags for `/tooted` and `/tooted/:slug` routes.

## Build Scripts Required

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:data": "node scripts/fetch-data.mjs",
    "build:client": "vite build",
    "build:ssr": "vite build --ssr src/entry-server.tsx --outDir dist/server",
    "prerender": "node scripts/prerender.mjs",
    "build": "npm run build:data && npm run build:client && npm run build:ssr && npm run prerender"
  }
}
```

## How It Works

1. **Data Fetching** (`scripts/fetch-data.mjs`): Fetches products, SEO data, and content from Supabase at build time and saves to JSON files.

2. **Client Build** (`vite build`): Creates the standard client-side build in `dist/client`.

3. **SSR Build** (`vite build --ssr`): Creates server-side build for rendering in `dist/server`.

4. **Prerender** (`scripts/prerender.mjs`): Uses the SSR build to generate static HTML files for each route.

## Generated Files

After running `npm run build`, you'll have:

- `dist/client/tooted/index.html` - Category page with proper SEO
- `dist/client/tooted/[slug]/index.html` - Individual product pages with:
  - Meta tags (title, description, keywords)
  - Open Graph and Twitter cards
  - JSON-LD structured data (Product + BreadcrumbList)
  - Canonical URLs

## Verification

Check that meta tags appear in "View Page Source":

```bash
# Category page
curl -s https://your-domain.ee/tooted | grep -i '<meta name="description"'

# Product page 
curl -s https://your-domain.ee/tooted/some-product | grep -i 'application/ld\\+json'
```

## Deploy

Upload the `dist/client` folder to your hosting provider. The static HTML files will be served with all SEO tags present in the initial response.

## Benefits

- ✅ SEO tags visible in "View Page Source"  
- ✅ Works without JavaScript
- ✅ Google Rich Results for products
- ✅ Social media sharing with proper previews
- ✅ Fast loading static files
- ✅ No runtime Node.js server needed