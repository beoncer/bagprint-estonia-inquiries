import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { PlusIcon, Trash2, Image } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Asset {
  id: string;
  type: string;
  url: string;
  created_at: string;
}

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState("banner");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");
  const [currentBannerUrl, setCurrentBannerUrl] = useState<string>("");
  const [currentNavbarLogoUrl, setCurrentNavbarLogoUrl] = useState<string>("");

  useEffect(() => {
    fetchAssets();
    // Fetch current logo, navbar logo, and banner URLs
    const fetchCurrent = async () => {
      const { data: logoData } = await supabase
        .from("footer_content")
        .select("value")
        .eq("key", "logo_image_url")
        .single();
      setCurrentLogoUrl(logoData?.value || "");
      const { data: navbarLogoData } = await supabase
        .from("website_content")
        .select("value")
        .eq("page", "global")
        .eq("key", "navbar_logo_url")
        .single();
      setCurrentNavbarLogoUrl(navbarLogoData?.value || "");
      const { data: bannerData } = await supabase
        .from("website_content")
        .select("value")
        .eq("page", "homepage")
        .eq("key", "homepage_banner_url")
        .single();
      setCurrentBannerUrl(bannerData?.value || "");
    };
    fetchCurrent();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_assets")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setAssets(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading assets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = `${assetType}/${fileName}`;
      
      setUploadProgress(30);
      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      setUploadProgress(70);
      // Get public URL
      const { data } = supabase.storage
        .from("site-assets")
        .getPublicUrl(filePath);
        
      // Save reference in database
      const { error } = await supabase
        .from("site_assets")
        .insert({
          type: assetType,
          url: data.publicUrl
        });
      
      if (error) throw error;
      
      setUploadProgress(100);
      toast({
        title: "Upload successful",
        description: "File has been uploaded",
      });
      
      setFile(null);
      setAssetType("banner");
      setIsUploadDialogOpen(false);
      await fetchAssets();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAsset = async () => {
    try {
      if (!selectedAsset) return;
      
      // First try to delete from storage if URL contains storage path
      if (selectedAsset.url.includes('supabase')) {
        try {
          // Extract path from URL - this is simplistic and may need adjustments
          const urlParts = selectedAsset.url.split('site-assets/');
          if (urlParts.length > 1) {
            const path = urlParts[1];
            await supabase.storage
              .from("site-assets")
              .remove([decodeURIComponent(path)]);
          }
        } catch (storageError) {
          console.error("Error removing from storage:", storageError);
          // Continue with DB deletion even if storage delete fails
        }
      }

      // Then delete the database record
      const { error } = await supabase
        .from("site_assets")
        .delete()
        .eq("id", selectedAsset.id);
        
      if (error) throw error;

      toast({
        title: "Asset deleted",
        description: "Asset has been deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setSelectedAsset(null);
      await fetchAssets();
    } catch (error: any) {
      toast({
        title: "Error deleting asset",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "URL copied",
        description: "Asset URL has been copied to clipboard",
      });
    });
  };

  const getAssetTypeLabel = (type: string) => {
    switch (type) {
      case "banner": return "Banner";
      case "logo": return "Logo";
      case "product": return "Product Image";
      case "icon": return "Icon";
      default: return type;
    }
  };

  const handleSetAsLogo = async (url: string) => {
    try {
      const { data, error } = await supabase.from("footer_content").upsert([
        {
          section: "logo",
          key: "logo_image_url",
          value: url,
          visible: true,
          order: 0,
        }
      ], { onConflict: "section,key,order" });
      if (error) {
        console.error("Error updating logo:", error);
        toast({ title: "Error updating logo", description: error.message, variant: "destructive" });
        return;
      }
      console.log("Logo upserted:", data);
      setCurrentLogoUrl(url);
      toast({ title: "Logo updated!" });
    } catch (err: any) {
      console.error("Unexpected error updating logo:", err);
      toast({ title: "Error updating logo", description: err.message, variant: "destructive" });
    }
  };

  const handleSetAsBanner = async (url: string) => {
    try {
      const { data, error } = await supabase.from("website_content").upsert([
        {
          page: "homepage",
          key: "homepage_banner_url",
          value: url
        }
      ], { onConflict: "page,key" });
      if (error) {
        console.error("Error updating banner:", error);
        toast({ title: "Error updating banner", description: error.message, variant: "destructive" });
        return;
      }
      console.log("Banner upserted:", data);
      setCurrentBannerUrl(url);
      toast({ title: "Banner updated!" });
    } catch (err: any) {
      console.error("Unexpected error updating banner:", err);
      toast({ title: "Error updating banner", description: err.message, variant: "destructive" });
    }
  };

  const handleSetAsNavbarLogo = async (url: string) => {
    try {
      const { data, error } = await supabase.from("website_content").upsert([
        {
          page: "global",
          key: "navbar_logo_url",
          value: url
        }
      ], { onConflict: "page,key" });
      if (error) {
        console.error("Error updating navbar logo:", error);
        toast({ title: "Error updating navbar logo", description: error.message, variant: "destructive" });
        return;
      }
      console.log("Navbar logo upserted:", data);
      setCurrentNavbarLogoUrl(url);
      toast({ title: "Navbar logo updated!" });
    } catch (err: any) {
      console.error("Unexpected error updating navbar logo:", err);
      toast({ title: "Error updating navbar logo", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Upload New Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Asset</DialogTitle>
              <DialogDescription>
                Upload a new image to the media library.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="asset-type" className="block text-sm font-medium pb-2">
                  Asset Type
                </label>
                <Select
                  value={assetType}
                  onValueChange={setAssetType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="product">Product Image</SelectItem>
                    <SelectItem value="icon">Icon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="file" className="block text-sm font-medium pb-2">
                  File
                </label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              {isUploading && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={handleUpload} 
                disabled={!file || isUploading}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Asset</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this asset? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAsset}>
                Delete
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
                <TableHead>Preview</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No assets uploaded yet
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="w-20">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {asset.url ? (
                          <img
                            src={asset.url}
                            alt={`Asset ${asset.id}`}
                            className="w-full h-full object-contain"
                            style={{ border: asset.url === currentLogoUrl ? '2px solid #e11d48' : asset.url === currentBannerUrl ? '2px solid #2563eb' : undefined }}
                          />
                        ) : (
                          <Image className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getAssetTypeLabel(asset.type)}</TableCell>
                    <TableCell className="max-w-md truncate">
                      <Button 
                        variant="link" 
                        onClick={() => copyToClipboard(asset.url)}
                        className="p-0 h-auto text-left text-blue-600 hover:text-blue-800"
                      >
                        {asset.url}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(asset.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right flex flex-col gap-2 items-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant={asset.url === currentLogoUrl ? "default" : "outline"} onClick={() => handleSetAsLogo(asset.url)}>
                              Set as Footer Logo
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Footer: 200x60px</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant={asset.url === currentNavbarLogoUrl ? "default" : "outline"} onClick={() => handleSetAsNavbarLogo(asset.url)}>
                              Set as Navbar Logo
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Navbar: 200x60px</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant={asset.url === currentBannerUrl ? "default" : "outline"} onClick={() => handleSetAsBanner(asset.url)}>
                              Set as Banner
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Banner: 1920x400px</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(asset)}
                      >
                        <Trash2 className="h-4 w-4" />
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

export default AssetsPage;
