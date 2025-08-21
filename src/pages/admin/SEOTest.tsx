import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface SEOTestResult {
  url: string;
  status: 'success' | 'error' | 'pending';
  title?: string;
  description?: string;
  hasStructuredData?: boolean;
  openGraphImage?: string;
}

export default function SEOTest() {
  const [testResults, setTestResults] = useState<SEOTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testPages = [
    { url: '/', name: 'Avaleht' },
    { url: '/tooted', name: 'Tooted' },
    { url: '/riidest-kotid', name: 'Riidest kotid' },
    { url: '/paberkotid', name: 'Paberkotid' },
    { url: '/nooriga-kotid', name: 'Nööriga kotid' },
    { url: '/kontakt', name: 'Kontakt' },
    { url: '/meist', name: 'Meist' }
  ];

  const runSEOTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const results: SEOTestResult[] = [];

      for (const page of testPages) {
        setTestResults(prev => [...prev, { url: page.url, status: 'pending' }]);

        try {
          // Test if the static SEO file exists by checking the actual HTML
          const response = await fetch(`${window.location.origin}${page.url}`);
          const html = await response.text();

          // Parse the HTML to check for proper meta tags
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const title = doc.querySelector('title')?.textContent;
          const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
          const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
          const structuredData = doc.querySelector('script[type="application/ld+json"]');

          results.push({
            url: page.url,
            status: title && description ? 'success' : 'error',
            title,
            description,
            hasStructuredData: !!structuredData,
            openGraphImage: ogImage
          });

        } catch (error) {
          console.error(`Error testing ${page.url}:`, error);
          results.push({
            url: page.url,
            status: 'error'
          });
        }
      }

      setTestResults(results);
      
      const successCount = results.filter(r => r.status === 'success').length;
      if (successCount === results.length) {
        toast.success(`Kõik ${successCount} lehte läbisid SEO testi!`);
      } else {
        toast.error(`${results.length - successCount} lehte vajab SEO parandamist`);
      }

    } catch (error) {
      console.error('SEO test failed:', error);
      toast.error('SEO testimine ebaõnnestus');
    } finally {
      setIsRunning(false);
    }
  };

  const generateSEOFiles = async () => {
    try {
      toast.info('Genereerime SEO faile...');
      
      // This would typically trigger the build script
      // For now, just show instructions
      toast.success('SEO failide genereerimiseks käivitage: npm run generate-seo');
      
    } catch (error) {
      console.error('SEO generation failed:', error);
      toast.error('SEO failide genereerimine ebaõnnestus');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SEO Testimine</h1>
          <p className="text-muted-foreground">
            Kontrollige, kas lehtedel on õiged meta tagid "View Page Source" vaates
          </p>
        </div>
        
        <div className="space-x-2">
          <Button onClick={generateSEOFiles} variant="outline">
            Genereeri SEO Failid
          </Button>
          <Button onClick={runSEOTest} disabled={isRunning}>
            {isRunning ? 'Testimine...' : 'Käivita SEO Test'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Seadistuse Juhised</CardTitle>
          <CardDescription>
            Staatiline SEO implementeerimine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Package.json Uuendamine Vajalik</h3>
            <p className="text-yellow-700 mb-2">
              Lisage järgmised skriptid oma package.json faili:
            </p>
            <pre className="bg-yellow-100 p-2 rounded text-sm overflow-x-auto">
{`"scripts": {
  "build:vite": "vite build",
  "build:seo": "node scripts/build-with-seo.js",
  "generate-seo": "node scripts/generate-seo-pages.js"
}`}</pre>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🚀 SEO Genereerimine</h3>
            <p className="text-blue-700 mb-2">Käivitage SEO failide genereerimiseks:</p>
            <code className="bg-blue-100 px-2 py-1 rounded">npm run generate-seo</code>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {testResults.map((result, index) => (
          <Card key={result.url} className="transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {result.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                  {result.status === 'pending' && <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                  
                  <div>
                    <h3 className="font-medium">
                      {testPages[index]?.name} ({result.url})
                    </h3>
                    {result.title && (
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {result.title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {result.hasStructuredData && (
                    <Badge variant="secondary">Structured Data</Badge>
                  )}
                  {result.openGraphImage && (
                    <Badge variant="secondary">OG Image</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`view-source:${window.location.origin}${result.url}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {result.description && (
                <p className="text-sm text-muted-foreground mt-2 truncate">
                  {result.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Käivitage SEO test, et kontrollida lehtede meta tagide olemasolu
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}