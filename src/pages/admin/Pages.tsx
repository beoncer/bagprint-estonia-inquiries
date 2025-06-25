import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2, ArrowUp, ArrowDown, PlusIcon, Search } from "lucide-react";

interface Page {
  id: string;
  name: string;
  slug: string;
  url_et: string;
  sort_order: number;
  visible: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface SEOMetadata {
  id: string;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
}

const emptyForm: Partial<Page> = {
  name: "",
  slug: "",
  url_et: "",
  sort_order: 0,
  visible: true,
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
};

const PagesAdmin: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [seoMetadata, setSeoMetadata] = useState<SEOMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Page>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pages")
      .select("id, name, slug, url_et, sort_order, visible, seo_title, seo_description, seo_keywords")
      .order("sort_order", { ascending: true });
    if (!error && data) setPages(data);
    setLoading(false);
  };

  const fetchSEOMetadata = async () => {
    const { data, error } = await supabase
      .from("seo_metadata")
      .select("*");
    if (!error && data) setSeoMetadata(data);
  };

  useEffect(() => { 
    fetchPages(); 
    fetchSEOMetadata();
  }, []);

  const handleDialogOpen = (page?: Page) => {
    if (page) {
      // If this is the main page (by name or slug), force slug to 'home'
      const isMainPage = page.slug === '' || page.slug === 'avaleht' || page.slug === 'Main page' || page.name.toLowerCase().includes('avaleht') || page.name.toLowerCase().includes('main');
      const forcedSlug = isMainPage ? 'home' : page.slug;
      // Get SEO data for this page
      const seoData = seoMetadata.find(seo => seo.page === forcedSlug);
      setFormData({
        ...page,
        slug: forcedSlug,
        seo_title: seoData?.title || "",
        seo_description: seoData?.description || "",
        seo_keywords: seoData?.keywords || "",
      });
      setEditingId(page.id);
    } else {
      setFormData(emptyForm);
      setEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    if (!formData.name || !formData.url_et) {
      toast({ title: "Missing fields", description: "Name and URL are required.", variant: "destructive" });
      setSaving(false);
      return;
    }
    // If this is the main page, force slug to 'home'
    let slug = formData.slug;
    const isMainPage = slug === '' || slug === 'avaleht' || slug === 'Main page' || (formData.name && formData.name.toLowerCase().includes('avaleht')) || (formData.name && formData.name.toLowerCase().includes('main'));
    if (isMainPage) slug = 'home';
    try {
      if (editingId) {
        // Update page
        const { error: pageError } = await supabase
          .from("pages")
          .update({
            name: formData.name,
            slug: slug,
            url_et: formData.url_et,
            sort_order: formData.sort_order,
            visible: formData.visible,
          })
          .eq("id", editingId);
        if (pageError) throw pageError;
        // Update or insert SEO metadata
        const existingSeo = seoMetadata.find(seo => seo.page === slug);
        if (existingSeo) {
          const { error: seoError } = await supabase
            .from("seo_metadata")
            .update({
              title: formData.seo_title || null,
              description: formData.seo_description || null,
              keywords: formData.seo_keywords || null,
            })
            .eq("id", existingSeo.id);
          if (seoError) throw seoError;
        } else {
          const { error: seoError } = await supabase
            .from("seo_metadata")
            .insert({
              page: slug,
              title: formData.seo_title || null,
              description: formData.seo_description || null,
              keywords: formData.seo_keywords || null,
            });
          if (seoError) throw seoError;
        }
        toast({ title: "Page updated successfully" });
      } else {
        // Insert new page
        const maxOrder = pages.length > 0 ? Math.max(...pages.map(p => p.sort_order || 0)) : 0;
        const { error: pageError } = await supabase
          .from("pages")
          .insert({
            name: formData.name,
            slug: slug,
            url_et: formData.url_et,
            sort_order: maxOrder + 1,
            visible: formData.visible ?? true,
          });
        if (pageError) throw pageError;
        // Insert SEO metadata if provided
        if (formData.seo_title || formData.seo_description || formData.seo_keywords) {
          const { error: seoError } = await supabase
            .from("seo_metadata")
            .insert({
              page: slug,
              title: formData.seo_title || null,
              description: formData.seo_description || null,
              keywords: formData.seo_keywords || null,
            });
          if (seoError) throw seoError;
        }
        toast({ title: "Page added successfully" });
      }
    } catch (error: any) {
      toast({ 
        title: "Error saving page", 
        description: error.message, 
        variant: "destructive" 
      });
    }
    setSaving(false);
    setIsDialogOpen(false);
    fetchPages();
    fetchSEOMetadata();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this page?")) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) toast({ title: "Error deleting page", description: error.message, variant: "destructive" });
    else toast({ title: "Page deleted" });
    fetchPages();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    let newPages = [...pages];
    if (direction === "up" && index > 0) {
      [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
    } else if (direction === "down" && index < newPages.length - 1) {
      [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
    } else {
      return;
    }
    // Reassign sort_order to be strictly sequential
    newPages = newPages.map((p, i) => ({ ...p, sort_order: i }));
    // Update all pages in Supabase
    await Promise.all(
      newPages.map((p) =>
        supabase.from("pages").update({ sort_order: p.sort_order }).eq("id", p.id)
      )
    );
    fetchPages();
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    await supabase.from("pages").update({ visible }).eq("id", id);
    fetchPages();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Main Menu Pages</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Page" : "Add New Page"}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="seo">SEO Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name (Estonian)</Label>
                  <Input 
                    id="name" 
                    value={formData.name || ""} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g. Avaleht" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug" 
                    value={formData.slug || ""} 
                    onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                    placeholder="e.g. avaleht" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url_et">URL (Estonian)</Label>
                  <Input 
                    id="url_et" 
                    value={formData.url_et || ""} 
                    onChange={e => setFormData({ ...formData, url_et: e.target.value })} 
                    placeholder="e.g. /avaleht" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="visible">Visible in Menu</Label>
                  <Switch 
                    id="visible" 
                    checked={formData.visible ?? true} 
                    onCheckedChange={v => setFormData({ ...formData, visible: v })} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input 
                    id="seo_title" 
                    value={formData.seo_title || ""} 
                    onChange={e => setFormData({ ...formData, seo_title: e.target.value })} 
                    placeholder="e.g. Leatex - Kvaliteetsed kotid ja pakendid" 
                  />
                  <p className="text-sm text-gray-500">
                    Title that appears in search results and browser tabs (50-60 characters recommended)
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea 
                    id="seo_description" 
                    value={formData.seo_description || ""} 
                    onChange={e => setFormData({ ...formData, seo_description: e.target.value })} 
                    placeholder="e.g. Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Küsi pakkumist juba täna!" 
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    Description that appears in search results (150-160 characters recommended)
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seo_keywords">SEO Keywords</Label>
                  <Input 
                    id="seo_keywords" 
                    value={formData.seo_keywords || ""} 
                    onChange={e => setFormData({ ...formData, seo_keywords: e.target.value })} 
                    placeholder="e.g. kotid, pakendid, puuvillakotid, paberkotid" 
                  />
                  <p className="text-sm text-gray-500">
                    Keywords separated by commas (optional, but can help with SEO)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave} disabled={saving}>
                {editingId ? "Save Changes" : "Add Page"}
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
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>SEO</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">No pages found</TableCell>
                </TableRow>
              ) : (
                pages.map((page, idx) => {
                  const hasSEO = seoMetadata.some(seo => seo.page === page.slug);
                  return (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleMove(idx, "up")} disabled={idx === 0}><ArrowUp className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleMove(idx, "down")} disabled={idx === pages.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                          {page.sort_order}
                        </div>
                      </TableCell>
                      <TableCell>{page.name}</TableCell>
                      <TableCell>{page.slug}</TableCell>
                      <TableCell>{page.url_et}</TableCell>
                      <TableCell>
                        {hasSEO ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Search className="h-3 w-3 mr-1" />
                            Configured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not set
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch checked={page.visible} onCheckedChange={v => handleToggleVisible(page.id, v)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDialogOpen(page)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(page.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PagesAdmin;
