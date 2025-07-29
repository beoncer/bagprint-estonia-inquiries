import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

const Sitemap: React.FC = () => {
  const [entries, setEntries] = useState<SitemapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemapData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: queryError } = await supabase
          .from('sitemap_entries')
          .select('*')
          .order('priority', { ascending: false });
        
        if (queryError) {
          console.error('Error fetching sitemap:', queryError);
          setError('Failed to load sitemap');
          return;
        }

        const baseUrl = 'https://leatex.ee';
        const formattedEntries = data.map(entry => ({
          url: `${baseUrl}${entry.url}`,
          lastmod: entry.lastmod,
          changefreq: entry.changefreq,
          priority: entry.priority
        }));
        
        setEntries(formattedEntries);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load sitemap');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemapData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading sitemap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-card rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Leatex.ee Sitemap</h1>
        <hr className="border-primary mb-6" />
        
        <div className="mb-6 space-y-2">
          <p><strong>Total URLs:</strong> {entries.length}</p>
          <p><strong>Last Generated:</strong> {new Date().toISOString().split('T')[0]}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-3 font-semibold">URL</th>
                <th className="text-left p-3 font-semibold">Last Modified</th>
                <th className="text-left p-3 font-semibold">Change Frequency</th>
                <th className="text-left p-3 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                  <td className="p-3">
                    <a 
                      href={entry.url} 
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.url}
                    </a>
                  </td>
                  <td className="p-3">{entry.lastmod}</td>
                  <td className="p-3">{entry.changefreq}</td>
                  <td className="p-3">
                    <span className={`font-semibold ${
                      entry.priority >= 0.8 ? 'text-green-600' :
                      entry.priority >= 0.6 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {entry.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;