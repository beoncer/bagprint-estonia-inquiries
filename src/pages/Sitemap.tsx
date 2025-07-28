import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Sitemap = () => {
  const [sitemapEntries, setSitemapEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemapData = async () => {
      try {
        setLoading(true);
        
        // Fetch sitemap entries directly
        const { data: entries, error } = await supabase
          .from('sitemap_entries')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (error) {
          console.error('Error fetching sitemap entries:', error);
          throw error;
        }

        setSitemapEntries(entries || []);
        
      } catch (error) {
        console.error('Failed to fetch sitemap data:', error);
        // Set fallback entries
        setSitemapEntries([
          {
            url: '/',
            priority: 1.0,
            changefreq: 'weekly',
            lastmod: new Date().toISOString().split('T')[0]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemapData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        minHeight: '100vh'
      }}>
        <h1>Loading Sitemap...</h1>
      </div>
    );
  }

  // Render as styled HTML that looks like a professional sitemap
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      minHeight: '100vh',
      margin: 0,
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '20px',
          textAlign: 'center' as const
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>XML Sitemap</h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
            This sitemap contains {sitemapEntries.length} URLs
          </p>
        </div>
        
        <div style={{ padding: '20px' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse' as const,
            backgroundColor: '#334155',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  backgroundColor: '#475569',
                  color: '#f1f5f9',
                  padding: '12px',
                  textAlign: 'left' as const,
                  fontWeight: 600,
                  borderBottom: '1px solid #64748b'
                }}>URL</th>
                <th style={{ 
                  backgroundColor: '#475569',
                  color: '#f1f5f9',
                  padding: '12px',
                  textAlign: 'left' as const,
                  fontWeight: 600,
                  borderBottom: '1px solid #64748b'
                }}>Priority</th>
                <th style={{ 
                  backgroundColor: '#475569',
                  color: '#f1f5f9',
                  padding: '12px',
                  textAlign: 'left' as const,
                  fontWeight: 600,
                  borderBottom: '1px solid #64748b'
                }}>Change Frequency</th>
                <th style={{ 
                  backgroundColor: '#475569',
                  color: '#f1f5f9',
                  padding: '12px',
                  textAlign: 'left' as const,
                  fontWeight: 600,
                  borderBottom: '1px solid #64748b'
                }}>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {sitemapEntries.map((entry, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #475569'
                }}>
                  <td style={{ padding: '12px' }}>
                    <a 
                      href={`https://leatex.ee${entry.url}`}
                      style={{ 
                        color: '#60a5fa',
                        textDecoration: 'none',
                        wordBreak: 'break-all' as const
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#93c5fd'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#60a5fa'; }}
                    >
                      https://leatex.ee{entry.url}
                    </a>
                  </td>
                  <td style={{ 
                    padding: '12px',
                    textAlign: 'center' as const,
                    fontWeight: 600,
                    color: entry.priority >= 0.8 ? '#10b981' : 
                           entry.priority >= 0.5 ? '#f59e0b' : '#94a3b8'
                  }}>
                    {entry.priority}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    textAlign: 'center' as const,
                    textTransform: 'capitalize' as const
                  }}>
                    {entry.changefreq}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    textAlign: 'center' as const,
                    fontFamily: 'monospace',
                    color: '#cbd5e1'
                  }}>
                    {entry.lastmod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ 
          textAlign: 'center' as const,
          padding: '20px',
          color: '#94a3b8',
          fontSize: '12px',
          borderTop: '1px solid #475569'
        }}>
          Generated on {new Date().toISOString().substring(0, 19)}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;