import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Set the base URL for sitemap generation
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    // Set the base URL in a way the database function can access it
    await supabaseClient.rpc('set_config', {
      setting_name: 'app.base_url',
      new_value: baseUrl,
      is_local: false
    }).catch(() => {
      // Ignore errors if set_config doesn't exist, we'll handle it in the XML generation
    });

    // First sync dynamic content
    const { error: syncError } = await supabaseClient.rpc('sync_dynamic_sitemap_entries');
    if (syncError) {
      console.error('Error syncing dynamic content:', syncError);
      throw syncError;
    }

    // Generate sitemap XML
    const { data: sitemapXml, error: xmlError } = await supabaseClient.rpc('generate_sitemap_xml');
    if (xmlError) {
      console.error('Error generating sitemap XML:', xmlError);
      throw xmlError;
    }

    // Add base URL to the XML if it wasn't added by the database function
    let finalXml = sitemapXml;
    if (finalXml && !finalXml.includes('http')) {
      finalXml = finalXml.replace(/<loc>/g, `<loc>${baseUrl}`);
      finalXml = finalXml.replace(/href="/g, `href="${baseUrl}`);
    }

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