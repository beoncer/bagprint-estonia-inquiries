import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Star, StarOff, Image } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  read_time: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface FeaturedBlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  read_time: string;
}

const BlogAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    read_time: "5 min",
    image_url: ""
  });
  
  // Dynamic content state for blog page
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaSubtitle, setCtaSubtitle] = useState("");
  const [ctaPhone, setCtaPhone] = useState("");
  const [ctaPhoneHours, setCtaPhoneHours] = useState("");
  const [ctaButton, setCtaButton] = useState("");
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Fetch featured blog posts
  const { data: featuredPosts = [] } = useQuery({
    queryKey: ['admin-featured-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_blog_posts')
        .select('*');
      if (error) throw error;
      return data as FeaturedBlogPost[];
    }
  });

  // Create/Update blog post mutation
  const savePostMutation = useMutation({
    mutationFn: async (postData: Partial<BlogPost>) => {
      if (editingPost) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: editingPost ? "Blog post updated successfully" : "Blog post created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save blog post: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-featured-blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ post, isFeatured }: { post: BlogPost; isFeatured: boolean }) => {
      if (isFeatured) {
        // Remove from featured
        const { error } = await supabase
          .from('featured_blog_posts')
          .delete()
          .eq('title', post.title);
        if (error) throw error;
      } else {
        // Add to featured
        const { error } = await supabase
          .from('featured_blog_posts')
          .insert({
            title: post.title,
            excerpt: post.excerpt,
            image_url: post.image_url,
            read_time: post.read_time
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-featured-blog-posts'] });
      toast({
        title: "Success",
        description: "Featured status updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update featured status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Fetch dynamic content for blog page
  const fetchContent = async () => {
    setContentLoading(true);
    const { data } = await supabase
      .from("website_content")
      .select("key, value")
      .eq("page", "blog");
    if (data) {
      setHeader(data.find((row: any) => row.key === "blog_header")?.value || "");
      setHeaderHighlight(data.find((row: any) => row.key === "blog_header_highlight")?.value || "");
      setDescription(data.find((row: any) => row.key === "blog_description")?.value || "");
      setCtaTitle(data.find((row: any) => row.key === "blog_cta_title")?.value || "");
      setCtaSubtitle(data.find((row: any) => row.key === "blog_cta_subtitle")?.value || "");
      setCtaPhone(data.find((row: any) => row.key === "blog_cta_phone")?.value || "");
      setCtaPhoneHours(data.find((row: any) => row.key === "blog_cta_phone_hours")?.value || "");
      setCtaButton(data.find((row: any) => row.key === "blog_cta_button")?.value || "");
    }
    setContentLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleContentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    setContentSuccess(false);
    const updates = [
      { page: "blog", key: "blog_header", value: header },
      { page: "blog", key: "blog_header_highlight", value: headerHighlight },
      { page: "blog", key: "blog_description", value: description },
      { page: "blog", key: "blog_cta_title", value: ctaTitle },
      { page: "blog", key: "blog_cta_subtitle", value: ctaSubtitle },
      { page: "blog", key: "blog_cta_phone", value: ctaPhone },
      { page: "blog", key: "blog_cta_phone_hours", value: ctaPhoneHours },
      { page: "blog", key: "blog_cta_button", value: ctaButton },
    ];
    const { error } = await supabase.from("website_content").upsert(updates, { onConflict: "page,key" });
    setContentSaving(false);
    if (!error) {
      setContentSuccess(true);
      toast({
        title: "Success",
        description: "Blog page content updated successfully"
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to save content: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      read_time: "5 min",
      image_url: ""
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      read_time: post.read_time,
      image_url: post.image_url
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate slug if not provided
    let slug = formData.slug;
    if (!slug) {
      slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    savePostMutation.mutate({
      ...formData,
      slug,
      updated_at: new Date().toISOString()
    });
  };

  const isPostFeatured = (post: BlogPost) => {
    return featuredPosts.some(fp => fp.title === post.title);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('et-EE');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
              <DialogDescription>
                {editingPost ? 'Update the blog post details below' : 'Fill in the details to create a new blog post'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <RichTextEditor
                  value={formData.excerpt}
                  onChange={(value) => setFormData(prev => ({ ...prev, excerpt: value }))}
                  placeholder="Write a brief excerpt..."
                  rows={3}
                />
              </div>

              <RichTextEditor
                label="Content"
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Write your blog post content here..."
                rows={12}
              />

              <div className="grid grid-cols-2 gap-4">
                <ImageUpload
                  label="Featured Image"
                  currentImageUrl={formData.image_url}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                />
                <div>
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                    placeholder="5 min"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={savePostMutation.isPending}>
                  {savePostMutation.isPending ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage all your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading blog posts...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.image_url && <Image className="h-4 w-4 text-gray-400" />}
                        <span className="font-medium">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{post.slug}</code>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeaturedMutation.mutate({ 
                          post, 
                          isFeatured: isPostFeatured(post) 
                        })}
                        disabled={toggleFeaturedMutation.isPending}
                      >
                        {isPostFeatured(post) ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(post.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePostMutation.mutate(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {blogPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No blog posts found. Create your first blog post!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Blog Posts</CardTitle>
          <CardDescription>Posts featured on the /tooted page</CardDescription>
        </CardHeader>
        <CardContent>
          {featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-sm">{post.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  <div className="text-xs text-gray-500 mt-2">{post.read_time}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No featured posts. Click the star icon next to any blog post to feature it.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dynamic content admin UI */}
      <form className="space-y-8 max-w-2xl mb-10" onSubmit={handleContentSave}>
        <h2 className="text-2xl font-bold mb-2">Blogi lehe sisu</h2>
        <div>
          <label className="block font-medium mb-1">Pealkiri (header)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Meie blogi"
            value={header}
            onChange={e => setHeader(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tõsta esile sõna (highlight word)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="blogi"
            value={headerHighlight}
            onChange={e => setHeaderHighlight(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
          <p className="text-sm text-gray-500 mt-1">Sisesta sõna, mida soovid pealkirjas punase värviga esile tõsta</p>
        </div>
        <div>
          <label className="block font-medium mb-1">Kirjeldus (description)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Kasulikud artiklid ja nõuanded kottide valimise, trükkimise ja kasutamise kohta"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
        </div>
        {/* CTA Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Kutse tegevusele (CTA)</h3>
          <div className="mb-2">
            <label className="block font-medium mb-1">Pealkiri (CTA title)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Küsimusi artiklite kohta?"
              value={ctaTitle}
              onChange={e => setCtaTitle(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Alapealkiri (CTA subtitle)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Võtke meiega ühendust!"
              value={ctaSubtitle}
              onChange={e => setCtaSubtitle(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Telefoninumber</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="+372 5919 7172"
              value={ctaPhone}
              onChange={e => setCtaPhone(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Tööajad</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Ootame kõnet tööpäeviti 9.00-17.00"
              value={ctaPhoneHours}
              onChange={e => setCtaPhoneHours(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nupu tekst</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Võta ühendust"
              value={ctaButton}
              onChange={e => setCtaButton(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
        </div>
        <Button type="submit" disabled={contentLoading || contentSaving}>
          {contentSaving ? "Salvestan..." : "Salvesta sisu"}
        </Button>
        {contentSuccess && <div className="text-green-600 mt-2">Salvestatud!</div>}
      </form>
    </div>
  );
};

export default BlogAdmin;
