
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchPages, PageOption } from "@/utils/pageUtils";

interface PageContent {
  id: string;
  page: string;
  section: string;
  content: string;
  content_type: 'text' | 'html' | 'json';
}

const PagesAdmin: React.FC = () => {
  const [pages, setPages] = useState<PageOption[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [newContent, setNewContent] = useState<{
    section: string;
    content: string;
    content_type: 'text' | 'html' | 'json';
  }>({
    section: "",
    content: "",
    content_type: "text"
  });
  const [loading, setLoading] = useState(false);
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

    loadPages();
  }, [toast]);

  const handleSaveContent = async () => {
    if (!selectedPage || !newContent.section || !newContent.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would typically save to Supabase
      // For now, we'll just simulate the save
      console.log("Saving content:", {
        page: selectedPage,
        ...newContent
      });

      toast({
        title: "Success",
        description: "Page content saved successfully",
      });

      // Reset form
      setNewContent({
        section: "",
        content: "",
        content_type: "text"
      });
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
            <CardTitle>Add/Edit Page Content</CardTitle>
            <CardDescription>
              Create or modify content for specific pages
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
              <Label htmlFor="section">Section/Element ID</Label>
              <Input
                id="section"
                placeholder="e.g., hero-title, footer-text, etc."
                value={newContent.section}
                onChange={(e) => setNewContent(prev => ({ ...prev, section: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="content-type">Content Type</Label>
              <Select 
                value={newContent.content_type} 
                onValueChange={(value: 'text' | 'html' | 'json') => 
                  setNewContent(prev => ({ ...prev, content_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter your content here..."
                rows={6}
                value={newContent.content}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
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
            {selectedPage ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  This section will show existing content for the selected page.
                  Content management functionality will be integrated with Supabase.
                </p>
                
                {/* Placeholder for existing content */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-500">
                    No existing content found for this page.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Please select a page to manage its content.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagesAdmin;
