import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2, ArrowUp, ArrowDown, PlusIcon, Upload } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  image_url: string;
  order: number;
  visible: boolean;
}

const emptyForm: Partial<PortfolioItem> = {
  title: "",
  description: "",
  category: "",
  tags: "",
  image_url: "",
  order: 0,
  visible: true,
};

const PortfolioAdmin: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio")
      .select("id, title, description, category, tags, image_url, order, visible")
      .order("order", { ascending: true });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDialogOpen = (item?: PortfolioItem) => {
    if (item) {
      setFormData(item);
      setEditingId(item.id);
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
    if (!formData.title) {
      toast({ title: "Missing title", description: "Title is required.", variant: "destructive" });
      setSaving(false);
      return;
    }
    if (editingId) {
      // Update
      const { error } = await supabase
        .from("portfolio")
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
          image_url: formData.image_url,
          order: formData.order,
          visible: formData.visible,
        })
        .eq("id", editingId);
      if (error) toast({ title: "Error updating portfolio item", description: error.message, variant: "destructive" });
      else toast({ title: "Portfolio item updated" });
    } else {
      // Insert
      const maxOrder = items.length > 0 ? Math.max(...items.map(p => p.order || 0)) : 0;
      const { error } = await supabase
        .from("portfolio")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
          image_url: formData.image_url,
          order: maxOrder + 1,
          visible: formData.visible ?? true,
        });
      if (error) toast({ title: "Error adding portfolio item", description: error.message, variant: "destructive" });
      else toast({ title: "Portfolio item added" });
    }
    setSaving(false);
    setIsDialogOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this portfolio item?")) return;
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) toast({ title: "Error deleting portfolio item", description: error.message, variant: "destructive" });
    else toast({ title: "Portfolio item deleted" });
    fetchItems();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    let newItems = [...items];
    if (direction === "up" && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    } else {
      return;
    }
    // Reassign order to be strictly sequential
    newItems = newItems.map((p, i) => ({ ...p, order: i }));
    // Update all items in Supabase
    await Promise.all(
      newItems.map((p) =>
        supabase.from("portfolio").update({ order: p.order }).eq("id", p.id)
      )
    );
    fetchItems();
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    await supabase.from("portfolio").update({ visible }).eq("id", id);
    fetchItems();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `portfolio/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('site-assets').upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Image upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('site-assets').getPublicUrl(filePath);
    setFormData((prev) => ({ ...prev, image_url: publicUrlData?.publicUrl || "" }));
    setUploading(false);
    toast({ title: "Image uploaded" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Lisa projekt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Muuda projekti" : "Lisa uus projekt"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Pealkiri</Label>
                <Input id="title" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Näiteks: Restoran Noa puuvillakotid" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Kirjeldus</Label>
                <Input id="description" value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Lühikirjeldus projektist" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategooria</Label>
                <Input id="category" value={formData.category || ""} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Näiteks: Riidest kotid" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Sildid (komaga eraldatud)</Label>
                <Input id="tags" value={formData.tags || ""} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="nt: Puuvill, Logo trükk, Premium" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Põhipilt</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Põhipilt" className="mt-2 rounded w-full max-h-40 object-contain" />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="visible">Nähtav</Label>
                <Switch id="visible" checked={formData.visible ?? true} onCheckedChange={v => setFormData({ ...formData, visible: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>Tühista</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave} disabled={saving}>{editingId ? "Salvesta muudatused" : "Lisa projekt"}</Button>
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
                <TableHead>Järjekord</TableHead>
                <TableHead>Pealkiri</TableHead>
                <TableHead>Kategooria</TableHead>
                <TableHead>Sildid</TableHead>
                <TableHead>Pilt</TableHead>
                <TableHead>Nähtav</TableHead>
                <TableHead className="text-right">Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">Ühtegi projekti ei leitud</TableCell>
                </TableRow>
              ) : (
                items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleMove(idx, "up")} disabled={idx === 0}><ArrowUp className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleMove(idx, "down")} disabled={idx === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                        {item.order}
                      </div>
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.tags}</TableCell>
                    <TableCell>{item.image_url ? <img src={item.image_url} alt="Pilt" className="w-16 h-16 object-cover rounded" /> : null}</TableCell>
                    <TableCell>
                      <Switch checked={item.visible} onCheckedChange={v => handleToggleVisible(item.id, v)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDialogOpen(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default PortfolioAdmin; 