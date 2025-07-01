import { generateSitemap } from '../src/utils/sitemapGenerator';

export default async function handler(req, res) {
  try {
    const xml = await generateSitemap();
    // If res is available (Node.js runtime)
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/xml');
      res.statusCode = 200;
      res.end(xml);
      return;
    }
    // Edge runtime fallback
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  } catch (error) {
    const fallback = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
    if (res && typeof res.setHeader === 'function') {
      res.statusCode = 500;
      res.end(fallback);
      return;
    }
    return new Response(fallback, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  }
} 