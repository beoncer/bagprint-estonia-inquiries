
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const generateSitemapXML = async (): Promise<string> => {
  const baseUrl = 'https://bagprint.ee';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages with priorities
  const staticPages: SitemapUrl[] = [
    { loc: '/', lastmod: currentDate, changefreq: 'weekly', priority: 1.0 },
    { loc: '/tooted', lastmod: currentDate, changefreq: 'weekly', priority: 0.9 },
    { loc: '/riidest-kotid', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { loc: '/paberkotid', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { loc: '/nooriga-kotid', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { loc: '/sussikotid', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { loc: '/kontakt', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/meist', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/portfoolio', lastmod: currentDate, changefreq: 'monthly', priority: 0.6 },
    { loc: '/blogi', lastmod: currentDate, changefreq: 'weekly', priority: 0.6 }
  ];

  let allUrls = [...staticPages];

  try {
    // Fetch dynamic product pages
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('visible', true)
      .not('slug', 'is', null);

    if (products) {
      const productUrls: SitemapUrl[] = products.map(product => ({
        loc: `/tooted/${product.slug}`,
        lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : currentDate,
        changefreq: 'weekly',
        priority: 0.7
      }));
      allUrls = [...allUrls, ...productUrls];
    }

    // Fetch dynamic blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .not('slug', 'is', null);

    if (blogPosts) {
      const blogUrls: SitemapUrl[] = blogPosts.map(post => ({
        loc: `/blogi/${post.slug}`,
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : currentDate,
        changefreq: 'monthly',
        priority: 0.5
      }));
      allUrls = [...allUrls, ...blogUrls];
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="et" href="${baseUrl}${url.loc}"/>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

const Sitemap = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const xml = await generateSitemapXML();
        setSitemapXML(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        setSitemapXML('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      }
    };

    fetchSitemap();
  }, []);

  // Set proper XML content type
  useEffect(() => {
    if (sitemapXML) {
      // Create and download XML file
      const blob = new Blob([sitemapXML], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Replace page content with XML
      document.open();
      document.write(sitemapXML);
      document.close();
      
      // Set proper content type
      if (document.contentType !== 'application/xml') {
        window.location.replace(`data:application/xml;charset=utf-8,${encodeURIComponent(sitemapXML)}`);
      }
    }
  }, [sitemapXML]);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      {sitemapXML || 'Generating sitemap...'}
    </div>
  );
};

export default Sitemap;
