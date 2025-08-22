import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/use-auth';
import { getProductBySlug, getSiteContent, supabase } from '@/lib/supabase';
import AppRoutes from './AppRoutes';

// Create a fresh QueryClient for each SSR request
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    },
  },
});

// Route matcher for data fetching
const getRouteData = async (url: string) => {
  // Get SEO data for current page
  const getSEOData = async (pageSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('page', pageSlug)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching SEO data:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      return null;
    }
  };

  // Map URLs to page slugs
  const getPageSlug = (url: string): string => {
    const routeToSlug: Record<string, string> = {
      '/': 'home',
      '/tooted': 'products',
      '/riidest-kotid': 'cotton-bags',
      '/paberkotid': 'paper-bags',
      '/nooriga-kotid': 'drawstring-bags',
      '/sussikotid': 'shoebags',
      '/kontakt': 'contact',
      '/meist': 'about',
      '/portfoolio': 'portfolio',
      '/blogi': 'blog',
    };

    return routeToSlug[url] || url.slice(1).replace(/\//g, '-') || 'home';
  };

  const pageSlug = getPageSlug(url);
  const seoData = await getSEOData(pageSlug);

  // Product detail pages
  const productMatch = url.match(/^\/tooted\/([^\/]+)\/?$/);
  if (productMatch) {
    try {
      const product = await getProductBySlug(productMatch[1]);
      return { product, pageType: 'product', seoData };
    } catch (error) {
      console.error('Product not found:', error);
      return { product: null, pageType: 'product', seoData };
    }
  }

  // Category pages
  if (url.match(/^\/(riidest-kotid|paberkotid|nooriga-kotid|sussikotid)\/?$/)) {
    return { pageType: 'category', seoData };
  }

  // Home and other pages
  return { pageType: 'default', seoData };
};

export async function render(url: string) {
  const helmetContext: any = {};
  const queryClient = createQueryClient();
  
  // Fetch data based on route
  const routeData = await getRouteData(url);
  
  // Get site content for global SEO
  let siteContent = {};
  try {
    siteContent = await getSiteContent();
  } catch (error) {
    console.error('Failed to fetch site content:', error);
  }

  const app = (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
              <StaticRouter location={url}>
                <AppRoutes routeData={routeData} currentUrl={url} />
              </StaticRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  let appHtml = '';
  let status = 200;

  try {
    appHtml = renderToString(app);
  } catch (error) {
    console.error('SSR render error:', error);
    status = 500;
    appHtml = '<div>Error rendering page</div>';
  }

  const { helmet } = helmetContext;
  
  // Get canonical URL
  const canonicalUrl = `https://leatex.ee${url}`;

  const html = `<!DOCTYPE html>
<html ${helmet.htmlAttributes?.toString() || 'lang="et"'}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="index, follow" />
  ${helmet.title?.toString() || '<title>Leatex - Kvaliteetsed kotid ja pakendid</title>'}
  ${helmet.meta?.toString() || '<meta name="description" content="Leatex pakub kvaliteetseid riidest kotte, paberkotte ja pakendeid. Kiire tarne üle Eesti." />'}
  ${helmet.link?.toString() || ''}
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Leatex" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" /> 
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index.css">
</head>
<body>
  <div id="root">${appHtml}</div>
  <script>window.__ROUTE_DATA__ = ${JSON.stringify(routeData)};</script>
</body>
</html>`;

  return { html, status };
}