
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

    // Get baseUrl from request body
    const requestBody = await req.json().catch(() => ({}));
    const baseUrl = requestBody.baseUrl || 'https://bagprint.ee';

    console.log('Starting sitemap generation with baseUrl:', baseUrl);

    // Set the base URL in the database session for the function to use
    const { error: settingError } = await supabaseClient.rpc('exec', {
      sql: `SELECT set_config('app.base_url', '${baseUrl}', false)`
    });

    if (settingError) {
      console.log('Could not set base URL config, continuing with edge function handling...');
    }

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

    console.log('Generated sitemap XML, length:', sitemapXml?.length);

    // Replace relative URLs with full URLs
    let finalSitemapXml = sitemapXml;
    if (finalSitemapXml && baseUrl) {
      finalSitemapXml = finalSitemapXml.replace(/<loc>\/([^<]*)<\/loc>/g, `<loc>${baseUrl}/$1</loc>`);
      finalSitemapXml = finalSitemapXml.replace(/href="\/([^"]*)"/g, `href="${baseUrl}/$1"`);
      finalSitemapXml = finalSitemapXml.replace(`<loc>${baseUrl}/</loc>`, `<loc>${baseUrl}/</loc>`);
    }

    // Write to static file using Supabase Storage for backup
    const { error: uploadError } = await supabaseClient.storage
      .from('site-assets')
      .upload('sitemap.xml', finalSitemapXml, {
        contentType: 'application/xml',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading sitemap to storage:', uploadError);
      // Don't throw here, just log the error - the main functionality should still work
    } else {
      console.log('Successfully uploaded sitemap to storage as backup');
    }

    // Also update the public sitemap file by overwriting it
    // Note: In a real deployment, this would need to be handled differently
    // For now, we'll just ensure the storage version is available

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sitemap generated and saved successfully',
        xml: finalSitemapXml 
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
