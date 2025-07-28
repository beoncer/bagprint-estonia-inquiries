import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end()
  }

  try {
    const supabaseClient = createClient(
      'https://ixotpxliaerkzjznyipi.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzgxNDU3NSwiZXhwIjoyMDYzMzkwNTc1fQ.JDJAhGIhXBHTVuJKAhZHk4_ux2eZLIEGt5KVqzBHElM'
    )

    // Get the base URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers.host
    const baseUrl = `${protocol}://${host}`
    
    console.log('Using base URL:', baseUrl)

    // Set the base URL as a session variable for the database function
    await supabaseClient.rpc('set_config', {
      setting_name: 'app.base_url',
      new_value: baseUrl,
      is_local: true
    })

    // First sync dynamic content
    const { error: syncError } = await supabaseClient.rpc('sync_dynamic_sitemap_entries')
    if (syncError) {
      console.error('Error syncing dynamic content:', syncError)
      throw syncError
    }

    // Generate sitemap XML
    const { data: sitemapXml, error: xmlError } = await supabaseClient.rpc('generate_sitemap_xml')
    if (xmlError) {
      console.error('Error generating sitemap XML:', xmlError)
      throw xmlError
    }

    // Set headers for XML response
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    res.status(200).send(sitemapXml)

  } catch (error) {
    console.error('Error in sitemap generation:', error)
    res.status(500).json({ 
      error: error.message,
      success: false 
    })
  }
}