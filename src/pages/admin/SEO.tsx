
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
import { PlusIcon, Edit } from "lucide-react";

interface SEOMetadata {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
}

const SEOPage: React.FC = () => {
  const [seoEntries, setSEOEntries] = useState<SEOMetadata[]>([]);
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
  }, []);

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
        title: "Viga SEO andmete laadimisel",
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
          title: "Valideerimisviga",
          description: "Leht on kohustuslik väli",
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
        title: "SEO andmed lisatud",
        description: "SEO andmed on edukalt lisatud",
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
    } catch (error: any) {
      toast({
        title: "Viga SEO andmete lisamisel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateSEO = async () => {
    try {
      if (!selectedEntry || !formData.page) {
        toast({
          title: "Valideerimisviga",
          description: "Leht on kohustuslik väli",
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
        title: "SEO andmed uuendatud",
        description: "SEO andmed on edukalt uuendatud",
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
        title: "Viga SEO andmete uuendamisel",
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
        <h1 className="text-3xl font-bold">SEO haldamine</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Lisa uus SEO kirje
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEntry ? "Muuda SEO andmeid" : "Lisa uus SEO kirje"}
              </DialogTitle>
              <DialogDescription>
                SEO metaandmed aitavad parandada teie veebisaidi nähtavust otsingutulemustes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="page">Leht</label>
                <Input
                  id="page"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  placeholder="Näiteks: home, products, contact"
                />
                <p className="text-sm text-gray-500">
                  Sisestage lehe identifikaator (URL tee, näiteks "home" avalehekülje jaoks).
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="title">Tiitel</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Meta pealkiri"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Kirjeldus</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Meta kirjeldus"
                />
                <p className="text-sm text-gray-500">
                  Lühike kirjeldus (150-160 tähemärki), mis kuvatakse otsingumootorite tulemustes.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="keywords">Märksõnad</label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="Märksõnad, eraldatud komadega"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Tühista
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={selectedEntry ? handleUpdateSEO : handleAddSEO}
              >
                {selectedEntry ? "Salvesta muudatused" : "Lisa SEO andmed"}
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
                <TableHead>Leht</TableHead>
                <TableHead>Tiitel</TableHead>
                <TableHead>Kirjeldus</TableHead>
                <TableHead>Märksõnad</TableHead>
                <TableHead className="text-right">Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seoEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    SEO andmeid pole lisatud
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
                        <Edit className="h-4 w-4 mr-1" /> Muuda
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
