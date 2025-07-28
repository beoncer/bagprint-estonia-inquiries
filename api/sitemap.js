export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end()
  }

  try {
    // Get the base URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers.host
    const baseUrl = `${protocol}://${host}`
    
    console.log('Using base URL:', baseUrl)

    // Use fetch to call the Supabase edge function
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
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    res.status(200).send(data.xml)

  } catch (error) {
    console.error('Error in sitemap generation:', error)
    res.status(500).json({ 
      error: error.message,
      success: false 
    })
  }
}