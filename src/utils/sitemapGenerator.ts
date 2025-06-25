import { supabase } from '@/lib/supabase';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://bagprint.ee';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages: SitemapUrl[] = [
    {
      loc: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: '/tooted',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: '/riidest-kotid',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: '/paberkotid',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: '/nooriga-kotid',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: '/sussikotid',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: '/kontakt',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: '/meist',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: '/portfoolio',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: '/blogi',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6
    }
  ];

  // Dynamic product pages
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .not('slug', 'is', null);

    const productUrls: SitemapUrl[] = (products || []).map(product => ({
      loc: `/tooted/${product.slug}`,
      lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : currentDate,
      changefreq: 'weekly',
      priority: 0.7
    }));

    // Dynamic blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .not('slug', 'is', null);

    const blogUrls: SitemapUrl[] = (blogPosts || []).map(post => ({
      loc: `/blogi/${post.slug}`,
      lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : currentDate,
      changefreq: 'monthly',
      priority: 0.5
    }));

    // Combine all URLs
    const allUrls = [...staticPages, ...productUrls, ...blogUrls];

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
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="et" href="${baseUrl}${url.loc}"/>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }
};

// Function to save sitemap to file (for build process)
export const saveSitemap = async (filePath: string = 'public/sitemap.xml') => {
  try {
    const sitemapContent = await generateSitemap();
    // In a real implementation, you would write to file
    // For now, we'll just return the content
    return sitemapContent;
  } catch (error) {
    console.error('Error saving sitemap:', error);
    throw error;
  }
}; 