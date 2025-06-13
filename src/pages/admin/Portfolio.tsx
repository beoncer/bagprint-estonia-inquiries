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
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [achievementsTitle, setAchievementsTitle] = useState("Meie saavutused");
  const [achievementsDescription, setAchievementsDescription] = useState("");
  const [achievements, setAchievements] = useState([{ value: "", label: "" }]);
  const [ctaTitle, setCtaTitle] = useState("Valmis oma projekti alustama?");
  const [ctaText, setCtaText] = useState("Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil.");
  const [ctaButton, setCtaButton] = useState("Küsi pakkumist");
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);

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

  useEffect(() => {
    const fetchContent = async () => {
      setContentLoading(true);
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "portfolio");
      if (data) {
        setHeader(data.find((row: any) => row.key === "portfolio_header")?.value || "");
        setHeaderHighlight(data.find((row: any) => row.key === "portfolio_header_highlight")?.value || "");
        setDescription(data.find((row: any) => row.key === "portfolio_description")?.value || "");
        setAchievementsTitle(data.find((row: any) => row.key === "portfolio_achievements_title")?.value || "Meie saavutused");
        setAchievementsDescription(data.find((row: any) => row.key === "portfolio_achievements_description")?.value || "");
        // Achievements
        const achArr = [];
        for (let i = 1; i <= 6; i++) {
          const value = data.find((row: any) => row.key === `portfolio_achievement_${i}_value`)?.value || "";
          const label = data.find((row: any) => row.key === `portfolio_achievement_${i}_label`)?.value || "";
          if (value || label) achArr.push({ value, label });
        }
        setAchievements(achArr.length ? achArr : [{ value: "", label: "" }]);
        setCtaTitle(data.find((row: any) => row.key === "portfolio_cta_title")?.value || "Valmis oma projekti alustama?");
        setCtaText(data.find((row: any) => row.key === "portfolio_cta_text")?.value || "Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil.");
        setCtaButton(data.find((row: any) => row.key === "portfolio_cta_button")?.value || "Küsi pakkumist");
      }
      setContentLoading(false);
    };
    fetchContent();
  }, []);

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

  const handleContentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    setContentSuccess(false);
    const updates = [
      { page: "portfolio", key: "portfolio_header", value: header },
      { page: "portfolio", key: "portfolio_header_highlight", value: headerHighlight },
      { page: "portfolio", key: "portfolio_description", value: description },
      { page: "portfolio", key: "portfolio_achievements_title", value: achievementsTitle },
      { page: "portfolio", key: "portfolio_achievements_description", value: achievementsDescription },
      ...achievements.map((a, i) => [
        { page: "portfolio", key: `portfolio_achievement_${i + 1}_value`, value: a.value },
        { page: "portfolio", key: `portfolio_achievement_${i + 1}_label`, value: a.label },
      ]).flat(),
      { page: "portfolio", key: "portfolio_cta_title", value: ctaTitle },
      { page: "portfolio", key: "portfolio_cta_text", value: ctaText },
      { page: "portfolio", key: "portfolio_cta_button", value: ctaButton },
    ];
    const { error } = await supabase.from("website_content").upsert(updates, { onConflict: "page,key" });
    setContentSaving(false);
    if (!error) setContentSuccess(true);
  };

  const handleAchievementChange = (idx: number, field: "value" | "label", val: string) => {
    setAchievements(achievements => achievements.map((a, i) => i === idx ? { ...a, [field]: val } : a));
  };
  const addAchievement = () => setAchievements([...achievements, { value: "", label: "" }]);
  const removeAchievement = (idx: number) => setAchievements(achievements => achievements.filter((_, i) => i !== idx));

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
      {/* Dynamic content admin UI */}
      <form className="space-y-8 max-w-2xl mb-10" onSubmit={handleContentSave}>
        <h2 className="text-2xl font-bold mb-2">Portfoolio lehe sisu</h2>
        <div>
          <label className="block font-medium mb-1">Pealkiri (header)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Meie portfoolio"
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
            placeholder="portfoolio"
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
            placeholder="Tutvu meie valmistatud kottidega..."
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
        </div>
        {/* Achievements Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Meie saavutused</h3>
          <div className="mb-2">
            <label className="block font-medium mb-1">Bloki pealkiri</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Meie saavutused"
              value={achievementsTitle}
              onChange={e => setAchievementsTitle(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Bloki kirjeldus</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Numbrid, mis räägivad meie kogemusest"
              rows={2}
              value={achievementsDescription}
              onChange={e => setAchievementsDescription(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          {achievements.map((a, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                className="border rounded px-2 py-1 w-24"
                placeholder="Väärtus"
                value={a.value}
                onChange={e => handleAchievementChange(idx, "value", e.target.value)}
                disabled={contentLoading || contentSaving}
              />
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Silt"
                value={a.label}
                onChange={e => handleAchievementChange(idx, "label", e.target.value)}
                disabled={contentLoading || contentSaving}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => removeAchievement(idx)} disabled={achievements.length === 1 || contentLoading || contentSaving}>Eemalda</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addAchievement} disabled={contentLoading || contentSaving}>Lisa saavutus</Button>
        </div>
        {/* CTA Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Kutse tegevusele (CTA)</h3>
          <div className="mb-2">
            <label className="block font-medium mb-1">Pealkiri (CTA title)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Valmis oma projekti alustama?"
              value={ctaTitle}
              onChange={e => setCtaTitle(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Kirjeldus (CTA text)</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil."
              rows={2}
              value={ctaText}
              onChange={e => setCtaText(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nupp (CTA button text)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Küsi pakkumist"
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

export default PortfolioAdmin; 