import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2, ArrowUp, ArrowDown, PlusIcon } from "lucide-react";

interface Page {
  id: string;
  name: string;
  slug: string;
  url_et: string;
  sort_order: number;
  visible: boolean;
}

const emptyForm: Partial<Page> = {
  name: "",
  slug: "",
  url_et: "",
  sort_order: 0,
  visible: true,
};

const PagesAdmin: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Page>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pages")
      .select("id, name, slug, url_et, sort_order, visible")
      .order("sort_order", { ascending: true });
    if (!error && data) setPages(data);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDialogOpen = (page?: Page) => {
    if (page) {
      setFormData(page);
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
    if (!formData.name || !formData.slug || !formData.url_et) {
      toast({ title: "Missing fields", description: "Name, slug, and URL are required.", variant: "destructive" });
      setSaving(false);
      return;
    }
    if (editingId) {
      // Update
      const { error } = await supabase
        .from("pages")
        .update({
          name: formData.name,
          slug: formData.slug,
          url_et: formData.url_et,
          sort_order: formData.sort_order,
          visible: formData.visible,
        })
        .eq("id", editingId);
      if (error) toast({ title: "Error updating page", description: error.message, variant: "destructive" });
      else toast({ title: "Page updated" });
    } else {
      // Insert
      const maxOrder = pages.length > 0 ? Math.max(...pages.map(p => p.sort_order || 0)) : 0;
      const { error } = await supabase
        .from("pages")
        .insert({
          name: formData.name,
          slug: formData.slug,
          url_et: formData.url_et,
          sort_order: maxOrder + 1,
          visible: formData.visible ?? true,
        });
      if (error) toast({ title: "Error adding page", description: error.message, variant: "destructive" });
      else toast({ title: "Page added" });
    }
    setSaving(false);
    setIsDialogOpen(false);
    fetchPages();
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Page" : "Add New Page"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name (Estonian)</Label>
                <Input id="name" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Avaleht" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={formData.slug || ""} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. avaleht" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url_et">URL (Estonian)</Label>
                <Input id="url_et" value={formData.url_et || ""} onChange={e => setFormData({ ...formData, url_et: e.target.value })} placeholder="e.g. /avaleht" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="visible">Visible in Menu</Label>
                <Switch id="visible" checked={formData.visible ?? true} onCheckedChange={v => setFormData({ ...formData, visible: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave} disabled={saving}>{editingId ? "Save Changes" : "Add Page"}</Button>
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
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">No pages found</TableCell>
                </TableRow>
              ) : (
                pages.map((page, idx) => (
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
                      <Switch checked={page.visible} onCheckedChange={v => handleToggleVisible(page.id, v)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDialogOpen(page)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(page.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default PagesAdmin;
