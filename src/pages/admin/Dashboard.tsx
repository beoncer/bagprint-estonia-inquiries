
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, FileText, ImageIcon, Search } from "lucide-react";

interface AdminDashboardData {
  productCount: number;
  contentCount: number;
  assetsCount: number;
  seoCount: number;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData>({
    productCount: 0,
    contentCount: 0,
    assetsCount: 0,
    seoCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch product count
        const { count: productCount, error: productError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Fetch content count
        const { count: contentCount, error: contentError } = await supabase
          .from("website_content")
          .select("*", { count: "exact", head: true });

        // Fetch assets count
        const { count: assetsCount, error: assetsError } = await supabase
          .from("site_assets")
          .select("*", { count: "exact", head: true });

        // Fetch SEO count
        const { count: seoCount, error: seoError } = await supabase
          .from("seo_metadata")
          .select("*", { count: "exact", head: true });

        if (productError || contentError || assetsError || seoError) {
          throw new Error("Error fetching dashboard data");
        }

        setData({
          productCount: productCount || 0,
          contentCount: contentCount || 0,
          assetsCount: assetsCount || 0,
          seoCount: seoCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.productCount}</div>
            <p className="text-xs text-gray-500">Number of products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.contentCount}</div>
            <p className="text-xs text-gray-500">Number of content elements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Media</CardTitle>
            <ImageIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.assetsCount}</div>
            <p className="text-xs text-gray-500">Banner and logo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">SEO</CardTitle>
            <Search className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.seoCount}</div>
            <p className="text-xs text-gray-500">Number of SEO metadata</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-600">
          In this admin panel, you can manage your website content, products, images, and SEO settings.
          Use the sidebar on the left to navigate between different sections.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
