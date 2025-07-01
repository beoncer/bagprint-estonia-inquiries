
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, Edit, RefreshCw, Download, Trash2 } from "lucide-react";

interface SitemapEntry {
  id: string;
  url: string;
  priority: number;
  changefreq: string;
  lastmod: string;
  is_active: boolean;
  is_dynamic: boolean;
  source_table?: string;
  created_at: string;
  updated_at: string;
}

const AdminSitemap: React.FC = () => {
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<SitemapEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    priority: 0.5,
    changefreq: "weekly",
  });

  useEffect(() => {
    fetchSitemapEntries();
  }, []);

  const fetchSitemapEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sitemap_entries")
        .select("*")
        .order("priority", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setSitemapEntries(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading sitemap entries",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    try {
      if (!formData.url) {
        toast({
          title: "Validation error",
          description: "URL is required",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("sitemap_entries")
        .insert({
          url: formData.url.startsWith('/') ? formData.url : `/${formData.url}`,
          priority: formData.priority,
          changefreq: formData.changefreq,
          is_dynamic: false,
        });
        
      if (error) throw error;

      toast({
        title: "Sitemap entry added",
        description: "Entry has been added successfully",
      });

      setFormData({ url: "", priority: 0.5, changefreq: "weekly" });
      setIsDialogOpen(false);
      await fetchSitemapEntries();
    } catch (error: any) {
      toast({
        title: "Error adding entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateEntry = async () => {
    try {
      if (!selectedEntry) return;

      const { error } = await supabase
        .from("sitemap_entries")
        .update({
          url: formData.url.startsWith('/') ? formData.url : `/${formData.url}`,
          priority: formData.priority,
          changefreq: formData.changefreq,
        })
        .eq("id", selectedEntry.id);
        
      if (error) throw error;

      toast({
        title: "Sitemap entry updated",
        description: "Entry has been updated successfully",
      });

      setSelectedEntry(null);
      setIsDialogOpen(false);
      await fetchSitemapEntries();
    } catch (error: any) {
      toast({
        title: "Error updating entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("sitemap_entries")
        .update({ is_active: isActive })
        .eq("id", id);
        
      if (error) throw error;

      toast({
        title: "Entry updated",
        description: `Entry ${isActive ? "activated" : "deactivated"}`,
      });

      await fetchSitemapEntries();
    } catch (error: any) {
      toast({
        title: "Error updating entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sitemap_entries")
        .delete()
        .eq("id", id);
        
      if (error) throw error;

      toast({
        title: "Entry deleted",
        description: "Sitemap entry has been removed",
      });

      await fetchSitemapEntries();
    } catch (error: any) {
      toast({
        title: "Error deleting entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGenerateSitemap = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-sitemap');
      
      if (error) throw error;

      toast({
        title: "Sitemap generated",
        description: "Static sitemap.xml has been updated successfully",
      });

      await fetchSitemapEntries();
    } catch (error: any) {
      toast({
        title: "Error generating sitemap",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditClick = (entry: SitemapEntry) => {
    setSelectedEntry(entry);
    setFormData({
      url: entry.url,
      priority: entry.priority,
      changefreq: entry.changefreq,
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEntry(null);
    setFormData({ url: "", priority: 0.5, changefreq: "weekly" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sitemap Management</h1>
          <p className="text-gray-600 mt-2">Manage URLs included in your website's sitemap</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateSitemap}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Sitemap
              </>
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedEntry ? "Edit Sitemap Entry" : "Add New Sitemap Entry"}
                </DialogTitle>
                <DialogDescription>
                  Add or edit URLs to be included in your sitemap.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="url">URL Path</label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/example-page"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="priority">Priority (0.0 - 1.0)</label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="changefreq">Change Frequency</label>
                  <Select 
                    value={formData.changefreq} 
                    onValueChange={(value) => setFormData({ ...formData, changefreq: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={selectedEntry ? handleUpdateEntry : handleAddEntry}
                >
                  {selectedEntry ? "Save Changes" : "Add Entry"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <TableHead>URL</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Change Freq</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sitemapEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No sitemap entries found
                  </TableCell>
                </TableRow>
              ) : (
                sitemapEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.url}</TableCell>
                    <TableCell>{entry.priority}</TableCell>
                    <TableCell>{entry.changefreq}</TableCell>
                    <TableCell>{new Date(entry.lastmod).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={entry.is_dynamic ? "secondary" : "default"}>
                        {entry.is_dynamic ? "Dynamic" : "Static"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={entry.is_active}
                        onCheckedChange={(checked) => handleToggleActive(entry.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!entry.is_dynamic && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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

export default AdminSitemap;
