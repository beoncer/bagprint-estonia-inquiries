import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('Sitemap function called:', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Supabase client created');

    // Set the base URL for sitemap generation
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    console.log('Base URL:', baseUrl);
    
    // First sync dynamic content
    console.log('Syncing dynamic content...');
    const { error: syncError } = await supabaseClient.rpc('sync_dynamic_sitemap_entries');
    if (syncError) {
      console.error('Error syncing dynamic content:', syncError);
      throw syncError;
    }
    console.log('Dynamic content synced successfully');

    // Generate sitemap XML
    console.log('Generating sitemap XML...');
    const { data: sitemapXml, error: xmlError } = await supabaseClient.rpc('generate_sitemap_xml');
    if (xmlError) {
      console.error('Error generating sitemap XML:', xmlError);
      throw xmlError;
    }
    console.log('Sitemap XML generated, length:', sitemapXml?.length);

    // Add base URL to the XML if it wasn't added by the database function
    let finalXml = sitemapXml;
    if (finalXml && !finalXml.includes('http')) {
      finalXml = finalXml.replace(/<loc>/g, `<loc>${baseUrl}`);
      finalXml = finalXml.replace(/href="/g, `href="${baseUrl}`);
      console.log('Added base URL to XML');
    }

    console.log('Returning successful response');
    return new Response(finalXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      },
      status: 200
    });

  } catch (error) {
    console.error('Error in sitemap generation:', error);
    
    // Fallback XML
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    console.log('Returning fallback XML');
    return new Response(fallbackXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      },
      status: 200
    });
  }
});