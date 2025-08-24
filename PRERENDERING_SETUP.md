# 🎭 Pre-rendering Setup for SEO

This document explains how to use the pre-rendering setup to solve the SEO issue where Google bots see the same title/description on all pages.

## 🚀 **What This Solves**

- **Problem**: Google bots see the same HTML source for all pages (bad for SEO)
- **Solution**: Pre-render each route to static HTML with correct meta tags
- **Result**: Each page has unique, SEO-friendly HTML that Google bots can read

## 🛠️ **How It Works**

1. **Route Generation**: Script fetches all routes from Supabase (products, blog posts, etc.)
2. **Pre-rendering**: Vite plugin runs a headless browser to render each route
3. **Static Output**: Generates individual HTML files for each route
4. **SEO Fixed**: Each HTML file contains the correct meta tags and content

## 📋 **Available Scripts**

```bash
# Generate routes from database
npm run generate-routes

# Build with pre-rendering (recommended)
npm run build:prerender

# Build without pre-rendering
npm run build

# Development server
npm run dev
```

## 🔧 **Build Process**

### **Step 1: Generate Routes**
```bash
npm run generate-routes
```
- Fetches all product slugs from Supabase
- Fetches all blog post slugs from Supabase
- Saves to `src/routes.json`

### **Step 2: Build with Pre-rendering**
```bash
npm run build:prerender
```
- Builds the React app with Vite
- Runs pre-rendering for all routes
- Outputs static HTML files to `dist/` folder

## 📁 **Output Structure**

After building, your `dist/` folder will contain:
```
dist/
├── index.html (homepage)
├── kontakt/
│   └── index.html
├── meist/
│   └── index.html
├── tooted/
│   ├── index.html (products list)
│   ├── product-slug-1/
│   │   └── index.html
│   └── product-slug-2/
│       └── index.html
└── ... (other routes)
```

## 🌐 **Deployment Changes**

### **Before (SPA Mode)**
- All routes serve `index.html`
- React Router handles routing
- Google bots see same HTML for all pages

### **After (Static Mode)**
- Each route serves its own HTML file
- No SPA fallback needed
- Google bots see unique HTML for each page

## ⚠️ **Important Notes**

1. **Build Time**: Pre-rendering adds 2-5 minutes to build time
2. **File Size**: Each route becomes a separate HTML file
3. **Dynamic Content**: Still works after hydration (React takes over)
4. **Admin Routes**: Not pre-rendered (kept as SPA for security)

## 🔍 **Testing**

### **Check Pre-rendered Output**
1. Run `npm run build:prerender`
2. Check `dist/` folder for HTML files
3. Open HTML files in browser to verify content

### **Verify SEO**
1. View page source for different routes
2. Check that titles and descriptions are different
3. Verify meta tags are correct

## 🚨 **Troubleshooting**

### **Routes Not Generated**
- Check Supabase connection
- Verify database tables exist
- Check console for errors

### **Pre-rendering Fails**
- Ensure all dependencies are installed
- Check Vite configuration
- Verify routes.json exists

### **Meta Tags Not Working**
- Check DynamicSEO component
- Verify React hydration timing
- Check browser console for errors

## 📚 **Files Modified**

- `vite.config.ts` - Added pre-render plugin
- `scripts/generate-routes.js` - Route generation script
- `scripts/build-with-prerender.js` - Build automation
- `package.json` - Added build scripts

## 🎯 **Next Steps**

1. Test the build process
2. Deploy to staging environment
3. Verify SEO improvements
4. Monitor Google Search Console
5. Deploy to production

## 📞 **Support**

If you encounter issues:
1. Check the console output
2. Verify all dependencies are installed
3. Ensure Supabase is accessible
4. Check the generated routes.json file
