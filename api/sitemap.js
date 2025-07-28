export default async function handler(req, res) {
  try {
    // Get the base URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers.host
    const baseUrl = `${protocol}://${host}`
    
    // Call the Supabase edge function
    const response = await fetch(`https://ixotpxliaerkzjznyipi.supabase.co/functions/v1/generate-sitemap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3RweGxpYWVya3pqem55aXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTQ1NzUsImV4cCI6MjA2MzM5MDU3NX0.GCIW0R71JBJDvwqdqVSNKNwFuuzOp_Bvpd_ua4VQgtc`
      },
      body: JSON.stringify({ baseUrl })
    })

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate sitemap')
    }

    // Set headers for XML response
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.status(200).send(data.xml)

  } catch (error) {
    console.error('Error in sitemap generation:', error)
    
    // Fallback to static sitemap if dynamic fails
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${req.headers.host ? `https://${req.headers.host}/` : 'https://bagprint-estonia-inquiries.lovable.app/'}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.status(200).send(fallbackSitemap)
  }
}