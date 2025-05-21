import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Edit } from "lucide-react";
import { fetchPages } from "@/utils/pageUtils";

interface SEOMetadata {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
}

interface PageOption {
  value: string;
  label: string;
}

const SEOPage: React.FC = () => {
  const [seoEntries, setSEOEntries] = useState<SEOMetadata[]>([]);
  const [pageOptions, setPageOptions] = useState<PageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<SEOMetadata | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SEOMetadata>>({
    page: "",
    title: "",
    description: "",
    keywords: "",
  });

  useEffect(() => {
    fetchSEOEntries();
    loadPageOptions();
  }, []);

  const loadPageOptions = async () => {
    const options = await fetchPages();
    setPageOptions(options);
  };

  const fetchSEOEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("seo_metadata").select("*");
      
      if (error) throw error;
      
      if (data) {
        setSEOEntries(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading SEO data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSEO = async () => {
    try {
      if (!formData.page) {
        toast({
          title: "Validation error",
          description: "Page is a required field",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("seo_metadata")
        .insert({
          page: formData.page,
          title: formData.title || "",
          description: formData.description || "",
          keywords: formData.keywords || "",
        })
        .select();
        
      if (error) throw error;

      toast({
        title: "SEO data added",
        description: "SEO data has been added successfully",
      });

      // Reset form and close dialog
      setFormData({
        page: "",
        title: "",
        description: "",
        keywords: "",
      });
      setIsDialogOpen(false);
      
      await fetchSEOEntries();
      await loadPageOptions();
    } catch (error: any) {
      toast({
        title: "Error adding SEO data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateSEO = async () => {
    try {
      if (!selectedEntry || !formData.page) {
        toast({
          title: "Validation error",
          description: "Page is a required field",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("seo_metadata")
        .update({
          page: formData.page,
          title: formData.title || "",
          description: formData.description || "",
          keywords: formData.keywords || "",
        })
        .eq("id", selectedEntry.id);
        
      if (error) throw error;

      toast({
        title: "SEO data updated",
        description: "SEO data has been updated successfully",
      });

      // Reset form and close dialog
      setFormData({
        page: "",
        title: "",
        description: "",
        keywords: "",
      });
      setSelectedEntry(null);
      setIsDialogOpen(false);
      
      await fetchSEOEntries();
    } catch (error: any) {
      toast({
        title: "Error updating SEO data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (entry: SEOMetadata) => {
    setSelectedEntry(entry);
    setFormData({
      page: entry.page,
      title: entry.title || "",
      description: entry.description || "",
      keywords: entry.keywords || "",
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEntry(null);
    setFormData({
      page: "",
      title: "",
      description: "",
      keywords: "",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SEO Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New SEO Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEntry ? "Edit SEO Data" : "Add New SEO Entry"}
              </DialogTitle>
              <DialogDescription>
                SEO metadata helps improve your website's visibility in search results.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="page">Page</label>
                <Select 
                  value={formData.page} 
                  onValueChange={(value) => setFormData({ ...formData, page: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Select the page for this SEO metadata (URL path, e.g., "home" for homepage).
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Meta title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Meta description"
                />
                <p className="text-sm text-gray-500">
                  Short description (150-160 characters) shown in search engine results.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="keywords">Keywords</label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="Keywords, separated by commas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={selectedEntry ? handleUpdateSEO : handleAddSEO}
              >
                {selectedEntry ? "Save Changes" : "Add SEO Data"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seoEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No SEO data added
                  </TableCell>
                </TableRow>
              ) : (
                seoEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.page}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.keywords}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(entry)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SEOPage;
