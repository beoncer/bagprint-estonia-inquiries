
import { useEffect } from 'react';
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
    // Fetch dynamic product pages - removed the invalid 'visible' filter
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, updated_at')
      .not('slug', 'is', null);

    if (productsError) {
      console.error('Error fetching products for sitemap:', productsError);
    } else if (products && products.length > 0) {
      console.log(`Found ${products.length} products for sitemap`);
      const productUrls: SitemapUrl[] = products.map(product => ({
        loc: `/tooted/${product.slug}`,
        lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : currentDate,
        changefreq: 'weekly',
        priority: 0.7
      }));
      allUrls = [...allUrls, ...productUrls];
    } else {
      console.log('No products found for sitemap');
    }

    // Fetch dynamic blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .not('slug', 'is', null);

    if (blogError) {
      console.error('Error fetching blog posts for sitemap:', blogError);
    } else if (blogPosts && blogPosts.length > 0) {
      console.log(`Found ${blogPosts.length} blog posts for sitemap`);
      const blogUrls: SitemapUrl[] = blogPosts.map(post => ({
        loc: `/blogi/${post.slug}`,
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : currentDate,
        changefreq: 'monthly',
        priority: 0.5
      }));
      allUrls = [...allUrls, ...blogUrls];
    } else {
      console.log('No blog posts found for sitemap');
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  console.log(`Total URLs in sitemap: ${allUrls.length}`);

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
  useEffect(() => {
    const serveSitemap = async () => {
      try {
        const xml = await generateSitemapXML();
        
        // Set proper XML response
        const response = new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
          }
        });
        
        // Replace current page with XML content
        document.open();
        document.write(xml);
        document.close();
        
        // Set document content type
        Object.defineProperty(document, 'contentType', {
          value: 'application/xml',
          writable: false
        });
        
      } catch (error) {
        console.error('Error generating sitemap:', error);
        const fallbackXml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
        document.open();
        document.write(fallbackXml);
        document.close();
      }
    };

    serveSitemap();
  }, []);

  // This component shouldn't render anything visible as it serves XML
  return null;
};

export default Sitemap;
