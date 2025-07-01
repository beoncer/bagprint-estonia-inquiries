import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSitemap } from '@/utils/sitemapGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const xml = await generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
} 