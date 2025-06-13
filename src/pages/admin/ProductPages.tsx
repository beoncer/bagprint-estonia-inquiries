import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface ProductPageContent {
  id: string;
  title: string;
  description: string;
  highlight: string;
  seoTitle?: string;
  seoDescription?: string;
}

const ProductPagesAdmin: React.FC = () => {
  const [productPages, setProductPages] = useState<ProductPageContent[]>([
    {
      id: "cotton_bag",
      title: "Riidest kotid",
      description: "Vaata meie riidest kottide valikut.",
      highlight: "kotid",
      seoTitle: "Riidest kotid - Kvaliteetsed puuvillakotid",
      seoDescription: "Ostke kvaliteetsed riidest kotid. Suur valik, kiire tarne, soodne hind."
    },
    {
      id: "paper_bag",
      title: "Paberkotid",
      description: "Vaata meie paberkottide valikut.",
      highlight: "kotid",
      seoTitle: "Paberkotid - Keskkonnasõbralikud pakendid",
      seoDescription: "Keskkonnasõbralikud paberkotid teie brändile. Taaskasutatud materjal."
    },
    {
      id: "drawstring_bag",
      title: "Nööriga kotid",
      description: "Vaata meie nööriga kottide valikut.",
      highlight: "kotid",
      seoTitle: "Nööriga kotid - Mugavad seljakotid",
      seoDescription: "Mugavad nööriga kotid spordivahenditele ja väikestele esemetele."
    },
    {
      id: "shoebag",
      title: "Sussikotid",
      description: "Vaata meie sussikottide valikut.",
      highlight: "kotid",
      seoTitle: "Sussikotid - Jalanõude hoiustamine",
      seoDescription: "Hingavad sussikotid jalanõude hoiustamiseks ja transportimiseks."
    }
  ]);
  
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setContentLoading(true);
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "product_pages");
      
      if (data) {
        const updatedPages = productPages.map(page => ({
          ...page,
          title: data.find((row: any) => row.key === `${page.id}_title`)?.value || page.title,
          description: data.find((row: any) => row.key === `${page.id}_description`)?.value || page.description,
          highlight: data.find((row: any) => row.key === `${page.id}_highlight`)?.value || page.highlight,
          seoTitle: data.find((row: any) => row.key === `${page.id}_seo_title`)?.value || page.seoTitle,
          seoDescription: data.find((row: any) => row.key === `${page.id}_seo_description`)?.value || page.seoDescription,
        }));
        setProductPages(updatedPages);
      }
      setContentLoading(false);
    };
    fetchContent();
  }, []);

  const handlePageChange = (pageId: string, field: keyof ProductPageContent, value: string) => {
    setProductPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, [field]: value } : page
    ));
  };

  const handleContentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    setContentSuccess(false);
    
    const updates = productPages.flatMap(page => [
      { page: "product_pages", key: `${page.id}_title`, value: page.title },
      { page: "product_pages", key: `${page.id}_description`, value: page.description },
      { page: "product_pages", key: `${page.id}_highlight`, value: page.highlight },
      { page: "product_pages", key: `${page.id}_seo_title`, value: page.seoTitle || "" },
      { page: "product_pages", key: `${page.id}_seo_description`, value: page.seoDescription || "" },
    ]);
    
    const { error } = await supabase.from("website_content").upsert(updates, { onConflict: "page,key" });
    setContentSaving(false);
    
    if (!error) {
      setContentSuccess(true);
      toast({
        title: "Success",
        description: "Product pages content updated successfully"
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to save content: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getPageUrl = (pageId: string) => {
    const urlMap: Record<string, string> = {
      cotton_bag: "/riidest-kotid",
      paper_bag: "/paberkotid",
      drawstring_bag: "/nooriga-kotid",
      shoebag: "/sussikotid"
    };
    return urlMap[pageId] || "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Toote lehed</h1>
      </div>

      {/* Dynamic content admin UI */}
      <form className="space-y-8 mb-10" onSubmit={handleContentSave}>
        <h2 className="text-2xl font-bold mb-4">Toote lehtede sisu</h2>
        
        {productPages.map((page) => (
          <div key={page.id} className="border rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{page.title}</h3>
              <span className="text-sm text-gray-500">{getPageUrl(page.id)}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Pealkiri</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Riidest kotid"
                  value={page.title}
                  onChange={e => handlePageChange(page.id, "title", e.target.value)}
                  disabled={contentLoading || contentSaving}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Tõsta esile sõna</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="kotid"
                  value={page.highlight}
                  onChange={e => handlePageChange(page.id, "highlight", e.target.value)}
                  disabled={contentLoading || contentSaving}
                />
                <p className="text-sm text-gray-500 mt-1">Sõna, mida soovid pealkirjas punase värviga esile tõsta</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block font-medium mb-1">Kirjeldus</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Vaata meie riidest kottide valikut."
                rows={2}
                value={page.description}
                onChange={e => handlePageChange(page.id, "description", e.target.value)}
                disabled={contentLoading || contentSaving}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-medium mb-1">SEO pealkiri (valikuline)</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Riidest kotid - Kvaliteetsed puuvillakotid"
                  value={page.seoTitle || ""}
                  onChange={e => handlePageChange(page.id, "seoTitle", e.target.value)}
                  disabled={contentLoading || contentSaving}
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">SEO kirjeldus (valikuline)</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ostke kvaliteetsed riidest kotid..."
                  rows={2}
                  value={page.seoDescription || ""}
                  onChange={e => handlePageChange(page.id, "seoDescription", e.target.value)}
                  disabled={contentLoading || contentSaving}
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button type="submit" disabled={contentLoading || contentSaving}>
          {contentSaving ? "Salvestan..." : "Salvesta kõik lehed"}
        </Button>
        {contentSuccess && <div className="text-green-600 mt-2">Salvestatud!</div>}
      </form>
    </div>
  );
};

export default ProductPagesAdmin; 