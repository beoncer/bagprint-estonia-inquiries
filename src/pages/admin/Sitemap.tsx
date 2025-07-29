import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getSitemapStatus, updateStaticSitemap, rebuildSitemap, updateStaticSitemapFile, SitemapStatus } from '@/utils/sitemapUtils';
import { RefreshCw, Download, Settings, FileText, ShoppingBag, Calendar } from 'lucide-react';

const Sitemap: React.FC = () => {
  const [status, setStatus] = useState<SitemapStatus>({
    total: 0,
    staticPages: 0,
    products: 0,
    blogPosts: 0,
    lastGenerated: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const statusData = await getSitemapStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Error fetching status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sitemap status",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSitemap = async () => {
    setIsLoading(true);
    try {
      await updateStaticSitemapFile();
      await fetchStatus();
      toast({
        title: "Success",
        description: "Sitemap updated successfully. The dynamic sitemap will now show current content."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update sitemap",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRebuildSitemap = async () => {
    setIsLoading(true);
    try {
      await rebuildSitemap();
      await fetchStatus();
      toast({
        title: "Success",
        description: "Sitemap rebuilt successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to rebuild sitemap",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSitemap = () => {
    window.open('/sitemap.xml', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sitemap Management</h1>
          <p className="text-muted-foreground">
            Manage your website's sitemap and ensure search engines can discover all your content.
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.total}</div>
            <p className="text-xs text-muted-foreground">
              Total pages in sitemap
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Static Pages</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.staticPages}</div>
            <p className="text-xs text-muted-foreground">
              Fixed pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.products}</div>
            <p className="text-xs text-muted-foreground">
              Product pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.blogPosts}</div>
            <p className="text-xs text-muted-foreground">
              Blog articles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last Generated Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Last Generated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {status.lastGenerated ? new Date(status.lastGenerated).toLocaleString() : 'Never'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStatus}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Actions</CardTitle>
          <CardDescription>
            Update or rebuild your sitemap to include the latest content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleUpdateSitemap}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Update Sitemap
            </Button>

            <Button
              onClick={handleRebuildSitemap}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Rebuild Sitemap
            </Button>

            <Button
              onClick={handleViewSitemap}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              View Sitemap
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Sitemaps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Update Sitemap:</strong> Syncs current content and generates new XML
          </p>
          <p>
            • <strong>Rebuild Sitemap:</strong> Completely rebuilds all sitemap entries from scratch
          </p>
          <p>
            • <strong>View Sitemap:</strong> Opens the current sitemap.xml file in a new tab
          </p>
          <p>
            • The sitemap is automatically updated when you add new products or blog posts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sitemap; 