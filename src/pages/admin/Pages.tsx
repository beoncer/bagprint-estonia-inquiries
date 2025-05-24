
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchPages, PageOption } from "@/utils/pageUtils";
import { supabase } from "@/lib/supabase";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageContent {
  id: string;
  key: string;
  value: string;
  page: string;
  link?: string;
}

const PagesAdmin: React.FC = () => {
  const [pages, setPages] = useState<PageOption[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [allContent, setAllContent] = useState<PageContent[]>([]);
  const [newContent, setNewContent] = useState<{
    key: string;
    value: string;
    link: string;
    content_type: 'text' | 'html' | 'json';
  }>({
    key: "",
    value: "",
    link: "",
    content_type: "text"
  });
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPages = async () => {
      try {
        const pagesData = await fetchPages();
        setPages(pagesData);
        if (pagesData.length > 0) {
          setSelectedPage(pagesData[0].value);
        }
      } catch (error) {
        console.error("Error loading pages:", error);
        toast({
          title: "Error",
          description: "Failed to load pages",
          variant: "destructive",
        });
      }
    };

    const loadAllContent = async () => {
      try {
        setContentLoading(true);
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .order('page', { ascending: true })
          .order('key', { ascending: true });

        if (error) throw error;

        const contentData = (data || []).map(item => ({
          id: item.id,
          key: item.key,
          value: item.value || '',
          page: item.page,
          link: item.link || undefined
        }));

        setAllContent(contentData);
      } catch (error) {
        console.error("Error loading content:", error);
        toast({
          title: "Error",
          description: "Failed to load content from database",
          variant: "destructive",
        });
      } finally {
        setContentLoading(false);
      }
    };

    loadPages();
    loadAllContent();
  }, [toast]);

  useEffect(() => {
    if (selectedPage && allContent.length > 0) {
      const filteredContent = allContent.filter(content => content.page === selectedPage);
      setPageContent(filteredContent);
    }
  }, [selectedPage, allContent]);

  const handleSaveContent = async () => {
    if (!selectedPage || !newContent.key || !newContent.value) {
      toast({
        title: "Error",
        description: "Please fill in page, key, and value fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const insertData: any = {
        page: selectedPage,
        key: newContent.key,
        value: newContent.value
      };

      if (newContent.link) {
        insertData.link = newContent.link;
      }

      const { data, error } = await supabase
        .from('website_content')
        .insert(insertData)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page content saved successfully",
      });

      // Reset form
      setNewContent({
        key: "",
        value: "",
        link: "",
        content_type: "text"
      });

      // Refresh content
      const { data: refreshData, error: refreshError } = await supabase
        .from('website_content')
        .select('*')
        .order('page', { ascending: true })
        .order('key', { ascending: true });

      if (!refreshError && refreshData) {
        const contentData = refreshData.map(item => ({
          id: item.id,
          key: item.key,
          value: item.value || '',
          page: item.page,
          link: item.link || undefined
        }));
        setAllContent(contentData);
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content deleted successfully",
      });

      // Refresh content
      const { data: refreshData, error: refreshError } = await supabase
        .from('website_content')
        .select('*')
        .order('page', { ascending: true })
        .order('key', { ascending: true });

      if (!refreshError && refreshData) {
        const contentData = refreshData.map(item => ({
          id: item.id,
          key: item.key,
          value: item.value || '',
          page: item.page,
          link: item.link || undefined
        }));
        setAllContent(contentData);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Content Management</h1>
        <p className="text-gray-600 mt-2">
          Manage content for different pages of your website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add/Edit Content Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Page Content</CardTitle>
            <CardDescription>
              Create new content for specific pages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="page-select">Select Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content-key">Content Key</Label>
              <Input
                id="content-key"
                placeholder="e.g., hero-title, footer-text, etc."
                value={newContent.key}
                onChange={(e) => setNewContent(prev => ({ ...prev, key: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="content-value">Content Value</Label>
              <Textarea
                id="content-value"
                placeholder="Enter your content here..."
                rows={4}
                value={newContent.value}
                onChange={(e) => setNewContent(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="content-link">Link (Optional)</Label>
              <Input
                id="content-link"
                placeholder="e.g., /contact, https://example.com"
                value={newContent.link}
                onChange={(e) => setNewContent(prev => ({ ...prev, link: e.target.value }))}
              />
            </div>

            <Button 
              onClick={handleSaveContent} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Content"}
            </Button>
          </CardContent>
        </Card>

        {/* Current Page Content */}
        <Card>
          <CardHeader>
            <CardTitle>Current Page Content</CardTitle>
            <CardDescription>
              {selectedPage ? `Content for: ${pages.find(p => p.value === selectedPage)?.label}` : "Select a page to view content"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : selectedPage ? (
              <div className="space-y-4">
                {pageContent.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageContent.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {content.key}
                              {content.link && (
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={content.value}>
                              {content.value}
                            </div>
                            {content.link && (
                              <div className="text-xs text-gray-500 truncate" title={content.link}>
                                Link: {content.link}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-500">
                      No content found for this page.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Please select a page to manage its content.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Website Content</CardTitle>
          <CardDescription>
            Overview of all content across all pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contentLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allContent.length > 0 ? (
                  allContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {content.page}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {content.key}
                          {content.link && (
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={content.value}>
                          {content.value}
                        </div>
                        {content.link && (
                          <div className="text-xs text-gray-500 truncate" title={content.link}>
                            Link: {content.link}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      No content found in database
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PagesAdmin;
