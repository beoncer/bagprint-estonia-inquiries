#!/bin/bash

echo "🚀 Starting SEO-optimized build process for Vercel..."

# Ensure Node.js modules are available
export PATH="$PATH:./node_modules/.bin"

# Step 1: Fetch data from Supabase
echo "📊 Fetching data from Supabase..."
node scripts/fetch-data.mjs
if [ $? -ne 0 ]; then
  echo "❌ Data fetch failed"
  exit 1
fi

# Step 2: Build client
echo "🏗️ Building client..."
vite build
if [ $? -ne 0 ]; then
  echo "❌ Client build failed"
  exit 1
fi

# Step 3: Build SSR
echo "⚙️ Building SSR..."
vite build --ssr src/entry-server.tsx --outDir dist/server
if [ $? -ne 0 ]; then
  echo "❌ SSR build failed"
  exit 1
fi

# Step 4: Prerender
echo "📝 Generating static HTML..."
node scripts/prerender.mjs
if [ $? -ne 0 ]; then
  echo "❌ Prerender failed"
  exit 1
fi

echo "✅ Build complete! Static HTML files generated in dist/client with full SEO support."