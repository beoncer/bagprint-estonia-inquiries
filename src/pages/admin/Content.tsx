
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Edit, Save, Trash2, Check } from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  page: string;
}

interface PageOption {
  value: string;
  label: string;
}

const ContentPage: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [pageOptions, setPageOptions] = useState<PageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    key: "",
    value: "",
    page: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchContentItems();
    fetchPageOptions();
  }, []);

  const fetchContentItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("website_content").select("*");
      if (error) throw error;
      
      if (data) {
        setContentItems(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPageOptions = async () => {
    try {
      // Get unique pages from website_content table
      const { data: contentPagesData, error: contentError } = await supabase
        .from("website_content")
        .select("page");
      
      // Get unique pages from seo_metadata table
      const { data: seoPagesData, error: seoError } = await supabase
        .from("seo_metadata")
        .select("page");
      
      if (contentError) throw contentError;
      if (seoError) throw seoError;
      
      // Extract page values and remove duplicates manually
      const contentPages = contentPagesData?.map(item => item.page) || [];
      const seoPages = seoPagesData?.map(item => item.page) || [];
      
      // Combine and deduplicate pages
      const allPages = [
        ...contentPages,
        ...seoPages
      ];
      
      // Add default pages
      const defaultPages = ["home", "products", "contact", "about"];
      const uniquePages = Array.from(new Set([...allPages, ...defaultPages])).sort();
      
      const options = uniquePages.map(page => ({
        value: page,
        label: page.charAt(0).toUpperCase() + page.slice(1)
      }));
      
      setPageOptions(options);
    } catch (error: any) {
      console.error("Error fetching page options:", error);
    }
  };

  const handleAddContent = async () => {
    try {
      if (!formData.key || !formData.page) {
        toast({
          title: "Validation error",
          description: "Key and page are required fields",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("website_content")
        .insert({
          key: formData.key,
          value: formData.value || "",
          page: formData.page,
        })
        .select();
        
      if (error) throw error;

      toast({
        title: "Content added",
        description: "Content item has been successfully added",
      });

      // Reset form and close dialog
      setFormData({
        key: "",
        value: "",
        page: "",
      });
      setIsDialogOpen(false);
      
      await fetchContentItems();
      await fetchPageOptions();
    } catch (error: any) {
      toast({
        title: "Error adding content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditContent = async () => {
    try {
      if (!selectedItem || !formData.key || !formData.page) {
        toast({
          title: "Validation error",
          description: "Key and page are required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("website_content")
        .update({
          key: formData.key,
          value: formData.value || "",
          page: formData.page,
        })
        .eq("id", selectedItem.id);
        
      if (error) throw error;

      toast({
        title: "Content updated",
        description: "Content item has been successfully updated",
      });

      // Reset form and close dialog
      setFormData({
        key: "",
        value: "",
        page: "",
      });
      setSelectedItem(null);
      setIsDialogOpen(false);
      
      await fetchContentItems();
    } catch (error: any) {
      toast({
        title: "Error updating content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteContent = async () => {
    try {
      if (!selectedItem) return;

      const { error } = await supabase
        .from("website_content")
        .delete()
        .eq("id", selectedItem.id);
        
      if (error) throw error;

      toast({
        title: "Content deleted",
        description: "Content item has been successfully deleted",
      });

      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      await fetchContentItems();
    } catch (error: any) {
      toast({
        title: "Error deleting content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInlineEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  const saveInlineEdit = async () => {
    try {
      if (!editingId) return;

      const { error } = await supabase
        .from("website_content")
        .update({ value: editValue })
        .eq("id", editingId);
        
      if (error) throw error;

      toast({
        title: "Content updated",
        description: "Content item has been successfully updated",
      });

      // Update the local state
      setContentItems(
        contentItems.map((item) =>
          item.id === editingId ? { ...item, value: editValue } : item
        )
      );
      setEditingId(null);
      setEditValue("");
    } catch (error: any) {
      toast({
        title: "Error updating content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (item: ContentItem) => {
    setSelectedItem(item);
    setFormData({
      key: item.key,
      value: item.value,
      page: item.page,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (item: ContentItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setFormData({
      key: "",
      value: "",
      page: "",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Website Content</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Edit Content Item" : "Add New Content Item"}
              </DialogTitle>
              <DialogDescription>
                Complete the fields to {selectedItem ? "edit" : "add"} a content item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="key">Content Key</label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="Example: homepage_title"
                />
                <p className="text-sm text-gray-500">
                  The key is a unique identifier used to display content on the page.
                </p>
              </div>
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
                  Select the page where the content will be displayed.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="value">Content Value</label>
                <Textarea
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter content text"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={selectedItem ? handleEditContent : handleAddContent}
              >
                {selectedItem ? "Save Changes" : "Add Content"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Content Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this content item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteContent}>
                Delete
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
                <TableHead>Key</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No content items added
                  </TableCell>
                </TableRow>
              ) : (
                contentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.key}</TableCell>
                    <TableCell>{item.page}</TableCell>
                    <TableCell className="max-w-md">
                      {editingId === item.id ? (
                        <div className="flex items-center">
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="mr-2"
                            rows={3}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveInlineEdit}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words">{item.value}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingId !== item.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInlineEdit(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit Text
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default ContentPage;
