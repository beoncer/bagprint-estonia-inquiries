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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface FooterContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
  order: number;
  visible: boolean;
}

const emptyForm: Partial<FooterContentItem> = {
  section: "logo",
  key: "",
  value: "",
  order: 0,
  visible: true,
};

const sectionLabels: Record<string, string> = {
  logo: "Logo ja kirjeldus",
  kiirlingid: "Kiirlingid",
  tootekategooriad: "Tootekategooriad",
  kontakt: "Kontakt",
};

const keyOptions: Record<string, { value: string; label: string }[]> = {
  logo: [
    { value: "logo_text", label: "Logo tekst" },
    { value: "logo_description", label: "Logo kirjeldus" },
  ],
  kiirlingid: [
    { value: "column_title", label: "Veeru pealkiri" },
    { value: "link_label", label: "Lingitekst" },
  ],
  tootekategooriad: [
    { value: "column_title", label: "Veeru pealkiri" },
    { value: "link_label", label: "Lingitekst" },
  ],
  kontakt: [
    { value: "column_title", label: "Veeru pealkiri" },
    { value: "contact_label", label: "Kontaktitüüp" },
    { value: "contact_value", label: "Kontaktinfo" },
  ],
};

const FooterAdmin: React.FC = () => {
  const [items, setItems] = useState<FooterContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FooterContentItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("footer_content")
      .select("id, section, key, value, order, visible")
      .order("section", { ascending: true })
      .order("order", { ascending: true });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDialogOpen = (item?: FooterContentItem) => {
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
    if (!formData.section || !formData.key) {
      toast({ title: "Missing fields", description: "Section and key are required.", variant: "destructive" });
      setSaving(false);
      return;
    }
    if (editingId) {
      // Update
      const { error } = await supabase
        .from("footer_content")
        .update({
          section: formData.section,
          key: formData.key,
          value: formData.value,
          order: formData.order,
          visible: formData.visible,
        })
        .eq("id", editingId);
      if (error) toast({ title: "Error updating footer content", description: error.message, variant: "destructive" });
      else toast({ title: "Footer content updated" });
    } else {
      // Insert
      const maxOrder = items.filter(i => i.section === formData.section).length > 0 ? Math.max(...items.filter(i => i.section === formData.section).map(i => i.order || 0)) : 0;
      const { error } = await supabase
        .from("footer_content")
        .insert({
          section: formData.section,
          key: formData.key,
          value: formData.value,
          order: maxOrder + 1,
          visible: formData.visible ?? true,
        });
      if (error) toast({ title: "Error adding footer content", description: error.message, variant: "destructive" });
      else toast({ title: "Footer content added" });
    }
    setSaving(false);
    setIsDialogOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this footer content item?")) return;
    const { error } = await supabase.from("footer_content").delete().eq("id", id);
    if (error) toast({ title: "Error deleting footer content", description: error.message, variant: "destructive" });
    else toast({ title: "Footer content deleted" });
    fetchItems();
  };

  const handleMove = async (section: string, index: number, direction: "up" | "down") => {
    const sectionItems = items.filter(i => i.section === section);
    let newItems = [...sectionItems];
    if (direction === "up" && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    } else {
      return;
    }
    // Reassign order to be strictly sequential
    newItems = newItems.map((i, idx) => ({ ...i, order: idx }));
    // Update all items in Supabase
    await Promise.all(
      newItems.map((i) =>
        supabase.from("footer_content").update({ order: i.order }).eq("id", i.id)
      )
    );
    fetchItems();
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    await supabase.from("footer_content").update({ visible }).eq("id", id);
    fetchItems();
  };

  // Group items by section
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, FooterContentItem[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Footer sisu</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Lisa sisu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Muuda sisu" : "Lisa uus sisu"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="section">Sektsioon</Label>
                <Input id="section" value={formData.section || ""} onChange={e => setFormData({ ...formData, section: e.target.value })} placeholder="logo, kiirlingid, tootekategooriad, kontakt" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="key">Võti (key)</Label>
                <Select
                  value={formData.key || ""}
                  onValueChange={v => setFormData({ ...formData, key: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vali võti" />
                  </SelectTrigger>
                  <SelectContent>
                    {(keyOptions[formData.section || "logo"] || []).map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.key === "link_label" && (formData.section === "kiirlingid" || formData.section === "tootekategooriad") ? (
                <>
                  <Label>Lingitekst</Label>
                  <Input
                    value={formData.value ? (() => { try { return JSON.parse(formData.value).label; } catch { return formData.value; } })() : ""}
                    onChange={e => {
                      let url = "";
                      try { url = JSON.parse(formData.value || '{}').url || ""; } catch {}
                      setFormData({ ...formData, value: JSON.stringify({ label: e.target.value, url }) });
                    }}
                    placeholder="Lingitekst (nt: Riidest kotid)"
                  />
                  <Label>Lingiviide (URL)</Label>
                  <Input
                    value={formData.value ? (() => { try { return JSON.parse(formData.value).url; } catch { return ""; } })() : ""}
                    onChange={e => {
                      let label = "";
                      try { label = JSON.parse(formData.value || '{}').label || ""; } catch {}
                      setFormData({ ...formData, value: JSON.stringify({ label, url: e.target.value }) });
                    }}
                    placeholder="/riidest-kotid"
                  />
                </>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="value">Väärtus</Label>
                  <Input id="value" value={formData.value || ""} onChange={e => setFormData({ ...formData, value: e.target.value })} placeholder="Sisu väärtus" />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="visible">Nähtav</Label>
                <Switch id="visible" checked={formData.visible ?? true} onCheckedChange={v => setFormData({ ...formData, visible: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>Tühista</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave} disabled={saving}>{editingId ? "Salvesta muudatused" : "Lisa sisu"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        Object.keys(grouped).map((section) => (
          <div key={section} className="mb-10">
            <h2 className="text-xl font-bold mb-2">{sectionLabels[section] || section}</h2>
            <div className="bg-white rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Võti</TableHead>
                    <TableHead>Väärtus</TableHead>
                    <TableHead>Järjekord</TableHead>
                    <TableHead>Nähtav</TableHead>
                    <TableHead className="text-right">Tegevused</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grouped[section].map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.key}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleMove(section, idx, "up")} disabled={idx === 0}><ArrowUp className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleMove(section, idx, "down")} disabled={idx === grouped[section].length - 1}><ArrowDown className="h-4 w-4" /></Button>
                          {item.order}
                        </div>
                      </TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FooterAdmin; 