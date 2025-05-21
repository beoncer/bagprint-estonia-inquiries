
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
import { PlusIcon, Edit, Save, Trash2, Check } from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  page: string;
}

const ContentPage: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
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
        title: "Viga sisu laadimisel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async () => {
    try {
      if (!formData.key || !formData.page) {
        toast({
          title: "Valideerimisviga",
          description: "Võti ja leht on kohustuslikud väljad",
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
        title: "Sisu lisatud",
        description: "Sisu element on edukalt lisatud",
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
        title: "Viga sisu lisamisel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditContent = async () => {
    try {
      if (!selectedItem || !formData.key || !formData.page) {
        toast({
          title: "Valideerimisviga",
          description: "Võti ja leht on kohustuslikud väljad",
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
        title: "Sisu uuendatud",
        description: "Sisu element on edukalt uuendatud",
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
        title: "Viga sisu uuendamisel",
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
        title: "Sisu kustutatud",
        description: "Sisu element on edukalt kustutatud",
      });

      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      await fetchContentItems();
    } catch (error: any) {
      toast({
        title: "Viga sisu kustutamisel",
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
        title: "Sisu uuendatud",
        description: "Sisu element on edukalt uuendatud",
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
        title: "Viga sisu uuendamisel",
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
        <h1 className="text-3xl font-bold">Veebilehe sisu</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Lisa uus sisu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Muuda sisu elementi" : "Lisa uus sisu element"}
              </DialogTitle>
              <DialogDescription>
                Täitke väljad sisu elemendi {selectedItem ? "muutmiseks" : "lisamiseks"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="key">Sisu võti</label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="Näiteks: homepage_title"
                />
                <p className="text-sm text-gray-500">
                  Võti on unikaalne identifikaator, mida kasutatakse sisu kuvamiseks lehel.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="page">Leht</label>
                <Input
                  id="page"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  placeholder="Näiteks: home, about, contact"
                />
                <p className="text-sm text-gray-500">
                  Sisestage lehe nimi, kus sisu kuvatakse.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="value">Sisu väärtus</label>
                <Textarea
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Sisestage sisu tekst"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Tühista
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={selectedItem ? handleEditContent : handleAddContent}
              >
                {selectedItem ? "Salvesta muudatused" : "Lisa sisu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kustuta sisu element</DialogTitle>
              <DialogDescription>
                Kas olete kindel, et soovite sisu elemendi kustutada? Seda tegevust ei saa tagasi võtta.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Tühista
              </Button>
              <Button variant="destructive" onClick={handleDeleteContent}>
                Kustuta
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
                <TableHead>Võti</TableHead>
                <TableHead>Leht</TableHead>
                <TableHead>Väärtus</TableHead>
                <TableHead className="text-right">Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    Sisu elemente pole lisatud
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
                            <Edit className="h-4 w-4 mr-1" /> Muuda teksti
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
