import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
import { PlusIcon, Edit, Save, Trash2, Check, Star } from "lucide-react";
import { fetchPages } from "@/utils/pageUtils";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  page: string;
}

interface FeaturedBlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  read_time: string;
  created_at: string;
}

interface PageOption {
  value: string;
  label: string;
}

const ContentPage: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState<FeaturedBlogPost[]>([]);
  const [pageOptions, setPageOptions] = useState<PageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<FeaturedBlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteBlogDialogOpen, setIsDeleteBlogDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    key: "",
    value: "",
    page: "",
  });
  const [blogFormData, setBlogFormData] = useState<Partial<FeaturedBlogPost>>({
    title: "",
    excerpt: "",
    image_url: "",
    read_time: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [pageFilter, setPageFilter] = useState<string>("all");
  const [contentKeyOptions, setContentKeyOptions] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadPageOptions = async () => {
    const options = await fetchPages();
    setPageOptions(options);
  };

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

  const fetchContentKeyOptions = async () => {
    const { data, error } = await supabase
      .from("website_content")
      .select("key")
      .order("key", { ascending: true });
    if (!error && data) {
      const uniqueKeys = Array.from(new Set(data.map((item: any) => item.key)));
      setContentKeyOptions(uniqueKeys);
    }
  };

  const fetchFeaturedBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setFeaturedBlogPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading featured blog posts",
        description: error.message,
        variant: "destructive",
      });
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

  const handleAddBlogPost = async () => {
    try {
      if (!blogFormData.title || !blogFormData.excerpt) {
        toast({
          title: "Validation error",
          description: "Title and excerpt are required fields",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = blogFormData.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(`blog/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from("site-assets")
          .getPublicUrl(`blog/${fileName}`);

        imageUrl = data.publicUrl;
      }

      const { data, error } = await supabase
        .from("featured_blog_posts")
        .insert({
          title: blogFormData.title,
          excerpt: blogFormData.excerpt,
          image_url: imageUrl,
          read_time: blogFormData.read_time || "5 min",
        })
        .select();
        
      if (error) throw error;

      toast({
        title: "Blog post added",
        description: "Featured blog post has been successfully added",
      });

      setBlogFormData({
        title: "",
        excerpt: "",
        image_url: "",
        read_time: "",
      });
      setImageFile(null);
      setIsBlogDialogOpen(false);
      
      await fetchFeaturedBlogPosts();
    } catch (error: any) {
      toast({
        title: "Error adding blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditBlogPost = async () => {
    try {
      if (!selectedBlogPost || !blogFormData.title || !blogFormData.excerpt) {
        toast({
          title: "Validation error",
          description: "Title and excerpt are required fields",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = selectedBlogPost.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(`blog/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from("site-assets")
          .getPublicUrl(`blog/${fileName}`);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("featured_blog_posts")
        .update({
          title: blogFormData.title,
          excerpt: blogFormData.excerpt,
          image_url: imageUrl,
          read_time: blogFormData.read_time || "5 min",
        })
        .eq("id", selectedBlogPost.id);
        
      if (error) throw error;

      toast({
        title: "Blog post updated",
        description: "Featured blog post has been successfully updated",
      });

      setBlogFormData({
        title: "",
        excerpt: "",
        image_url: "",
        read_time: "",
      });
      setSelectedBlogPost(null);
      setImageFile(null);
      setIsBlogDialogOpen(false);
      
      await fetchFeaturedBlogPosts();
    } catch (error: any) {
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlogPost = async () => {
    try {
      if (!selectedBlogPost) return;

      const { error } = await supabase
        .from("featured_blog_posts")
        .delete()
        .eq("id", selectedBlogPost.id);
        
      if (error) throw error;

      toast({
        title: "Blog post deleted",
        description: "Featured blog post has been successfully deleted",
      });

      setIsDeleteBlogDialogOpen(false);
      setSelectedBlogPost(null);
      await fetchFeaturedBlogPosts();
    } catch (error: any) {
      toast({
        title: "Error deleting blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditBlogClick = (blogPost: FeaturedBlogPost) => {
    setSelectedBlogPost(blogPost);
    setBlogFormData({
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      image_url: blogPost.image_url,
      read_time: blogPost.read_time,
    });
    setIsBlogDialogOpen(true);
  };

  const handleDeleteBlogClick = (blogPost: FeaturedBlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsDeleteBlogDialogOpen(true);
  };

  // Filtered content items by page
  const filteredContentItems = pageFilter === "all"
    ? contentItems
    : contentItems.filter((item) => item.page === pageFilter);

  // Get unique page values for filter dropdown
  const uniquePages = Array.from(new Set(contentItems.map((item) => item.page)));

  useEffect(() => {
    fetchContentItems();
    fetchFeaturedBlogPosts();
    loadPageOptions();
    fetchContentKeyOptions();
  }, []);

  useEffect(() => {
    if (isDialogOpen && !formData.key && contentKeyOptions.length > 0) {
      setFormData((prev) => ({ ...prev, key: contentKeyOptions[0] }));
    }
    // eslint-disable-next-line
  }, [isDialogOpen, contentKeyOptions]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Website Content</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="page-filter" className="text-sm font-medium">Filter by page:</label>
          <Select value={pageFilter} onValueChange={setPageFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All pages</SelectItem>
              {uniquePages.map((page) => (
                <SelectItem key={page} value={page}>{page}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                <Select
                  value={formData.key || ""}
                  onValueChange={(value) => setFormData({ ...formData, key: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or type a key" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentKeyOptions
                      .filter(key => typeof key === "string" && key.trim() !== "")
                      .map((key) => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="Example: homepage_title"
                  className="mt-2"
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

      {/* Quick Add Section for /tooted page */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Quick Add - /tooted Page Content</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                key: "tooted_page_heading",
                value: "Meie tooted",
                page: "tooted"
              });
              setIsDialogOpen(true);
            }}
          >
            Add Page Heading
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                key: "tooted_page_description",
                value: "Sirvige laia valikut kotte ja pakendeid, mida saate kohandada vastavalt oma brändi vajadustele.",
                page: "tooted"
              });
              setIsDialogOpen(true);
            }}
          >
            Add Page Description
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                key: "tooted_blog_section_title",
                value: "Kasulikud artiklid",
                page: "tooted"
              });
              setIsDialogOpen(true);
            }}
          >
            Add Blog Section Title
          </Button>
        </div>
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
              {filteredContentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No content items added
                  </TableCell>
                </TableRow>
              ) : (
                filteredContentItems.map((item) => (
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

      {/* Featured Blog Posts Section */}
      <div className="mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">Featured Blog Posts</h2>
          <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedBlogPost ? "Edit Blog Post" : "Add New Blog Post"}
                </DialogTitle>
                <DialogDescription>
                  Featured blog posts appear on the /tooted page.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="blog-title">Title</label>
                  <Input
                    id="blog-title"
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    placeholder="Blog post title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="blog-excerpt">Excerpt</label>
                  <Textarea
                    id="blog-excerpt"
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    placeholder="Brief description of the blog post"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="blog-read-time">Read Time</label>
                  <Input
                    id="blog-read-time"
                    value={blogFormData.read_time}
                    onChange={(e) => setBlogFormData({ ...blogFormData, read_time: e.target.value })}
                    placeholder="e.g., 5 min"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="blog-image">Image</label>
                  <Input
                    id="blog-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImageFile(file);
                    }}
                  />
                  {blogFormData.image_url && !imageFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Current image:</p>
                      <img 
                        src={blogFormData.image_url} 
                        alt="Current" 
                        className="w-32 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsBlogDialogOpen(false);
                  setSelectedBlogPost(null);
                  setBlogFormData({
                    title: "",
                    excerpt: "",
                    image_url: "",
                    read_time: "",
                  });
                  setImageFile(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700" 
                  onClick={selectedBlogPost ? handleEditBlogPost : handleAddBlogPost}
                >
                  {selectedBlogPost ? "Save Changes" : "Add Blog Post"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Excerpt</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredBlogPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No featured blog posts added
                  </TableCell>
                </TableRow>
              ) : (
                featuredBlogPosts.map((blogPost) => (
                  <TableRow key={blogPost.id}>
                    <TableCell>
                      {blogPost.image_url && (
                        <img
                          src={blogPost.image_url}
                          alt={blogPost.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{blogPost.title}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="whitespace-pre-wrap break-words">{blogPost.excerpt}</div>
                    </TableCell>
                    <TableCell>{blogPost.read_time}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBlogClick(blogPost)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBlogClick(blogPost)}
                          className="text-red-600 hover:text-red-700"
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
      </div>

      {/* Delete Blog Post Confirmation Dialog */}
      <Dialog open={isDeleteBlogDialogOpen} onOpenChange={setIsDeleteBlogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this featured blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteBlogDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlogPost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentPage;
