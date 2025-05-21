
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Asset {
  id: string;
  type: "banner" | "logo";
  url: string;
}

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("site_assets").select("*");
      
      if (error) throw error;
      
      if (data) {
        setAssets(data as Asset[]);
      }
    } catch (error: any) {
      toast({
        title: "Error loading images",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBanner = () => {
    return assets.find((asset) => asset.type === "banner");
  };

  const getLogo = () => {
    return assets.find((asset) => asset.type === "logo");
  };

  const handleFileUpload = async (type: "banner" | "logo", file: File | null) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create a unique file name
      const fileName = `${type}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(`${type}/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(`${type}/${fileName}`);
      
      const publicUrl = urlData.publicUrl;
      
      // Check if we already have this asset type
      const existingAsset = assets.find((asset) => asset.type === type);
      
      if (existingAsset) {
        // Update existing asset
        const { error } = await supabase
          .from("site_assets")
          .update({ url: publicUrl })
          .eq("id", existingAsset.id);
          
        if (error) throw error;
      } else {
        // Create new asset
        const { error } = await supabase.from("site_assets").insert({
          type,
          url: publicUrl,
        });
        
        if (error) throw error;
      }
      
      toast({
        title: "Image updated",
        description: `${type === "banner" ? "Banner" : "Logo"} has been successfully updated.`,
      });
      
      // Reset file input and refresh assets
      if (type === "banner") {
        setBannerFile(null);
      } else {
        setLogoFile(null);
      }
      
      await fetchAssets();
      
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Media Management</h1>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner Management */}
          <Card>
            <CardHeader>
              <CardTitle>Website Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getBanner() ? (
                <div className="aspect-[3/1] relative bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={getBanner()!.url}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[3/1] bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">No banner available</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="banner-upload" className="text-sm font-medium">
                  Update banner
                </label>
                <Input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 1920x640px. Maximum size: 5MB.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                disabled={!bannerFile || uploading}
                onClick={() => handleFileUpload("banner", bannerFile)}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Uploading...
                  </span>
                ) : (
                  "Save Banner"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Logo Management */}
          <Card>
            <CardHeader>
              <CardTitle>Website Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getLogo() ? (
                <div className="h-40 relative bg-gray-100 rounded-md overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={getLogo()!.url}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">No logo available</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="logo-upload" className="text-sm font-medium">
                  Update logo
                </label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 200x80px. Maximum size: 2MB.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                disabled={!logoFile || uploading}
                onClick={() => handleFileUpload("logo", logoFile)}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Uploading...
                  </span>
                ) : (
                  "Save Logo"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
