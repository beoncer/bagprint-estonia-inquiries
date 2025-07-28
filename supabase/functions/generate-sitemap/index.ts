
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

    console.log('Starting sitemap generation...');

    // First sync dynamic content
    const { error: syncError } = await supabaseClient.rpc('sync_dynamic_sitemap_entries');
    if (syncError) {
      console.error('Error syncing dynamic content:', syncError);
      throw syncError;
    }

    // Generate sitemap XML with XSL reference
    const { data: sitemapXml, error: xmlError } = await supabaseClient.rpc('generate_sitemap_xml');
    if (xmlError) {
      console.error('Error generating sitemap XML:', xmlError);
      throw xmlError;
    }

    // Add XSL stylesheet reference to the XML
    const styledSitemapXml = sitemapXml.replace(
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
    );

    console.log('Generated sitemap XML, length:', sitemapXml?.length);

    // Write to static file using Supabase Storage
    const { error: uploadError } = await supabaseClient.storage
      .from('site-assets')
      .upload('sitemap.xml', styledSitemapXml, {
        contentType: 'application/xml',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading sitemap:', uploadError);
      throw uploadError;
    }

    console.log('Successfully uploaded sitemap to storage');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sitemap generated and saved successfully',
        xml: styledSitemapXml 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sitemap generation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
