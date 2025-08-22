import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '/';
  
  try {
    // For now, serve a simple HTML with correct SEO until full SSR is deployed
    const seoData = await getSEOData(url);
    
    const html = generateHTML(url, seoData);
    
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    
  } catch (error: any) {
    console.error('SSR Error:', error);
    
    // Fallback to client-side rendering
    const fallbackHtml = `<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Leatex – Paberkotid, puuvillakotid ja rohelised lahendused</title>
  <meta name="description" content="Kvaliteetsed ja keskkonnasõbralikud kotid ning pakendid. Puuvillakotid, paberkotid, kinkekotid ja palju muud. Küsi pakkumist!" />
  <link rel="canonical" href="https://leatex.ee${url}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index.css">
</body>
</html>`;
    
    res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(fallbackHtml);
  }
}

async function getSEOData(url: string) {
  // Import Supabase client - this will work even without full SSR
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    'https://ixotpxliaerkzjznyipi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc'
  );

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

  try {
    const pageSlug = getPageSlug(url);
    const { data } = await supabase
      .from('seo_metadata')
      .select('*')
      .eq('page', pageSlug)
      .maybeSingle();
    
    return data;
  } catch (error) {
    console.error('SEO fetch error:', error);
    return null;
  }
}

function generateHTML(url: string, seoData: any) {
  const title = seoData?.title || "Leatex – Paberkotid, puuvillakotid ja rohelised lahendused";
  const description = seoData?.description || "Kvaliteetsed ja keskkonnasõbralikud kotid ning pakendid. Puuvillakotid, paberkotid, kinkekotid ja palju muud. Küsi pakkumist!";
  const canonicalUrl = `https://leatex.ee${url}`;

  return `<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Leatex" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</head>
<body>
  <div id="root"></div>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index.css">
</body>
</html>`;
}