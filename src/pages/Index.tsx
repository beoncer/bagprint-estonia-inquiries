
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/product/ProductGrid";
import { Link } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";
import { ProductProps } from "@/components/product/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  type: string;
  pricing_without_print: Json;
  pricing_with_print: Json;
}

const Index = () => {
  const [popularProducts, setPopularProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState({
    hero_title: "Custom Printed Bags for Your Business",
    hero_subtitle: "High-quality cotton, paper, and drawstring bags with your brand",
    about_title: "About Us",
    about_text: "We offer sustainable and customizable packaging solutions for businesses of all sizes.",
  });

  useEffect(() => {
    fetchPopularProducts();
    fetchContentData();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      // Fetch products marked as popular
      const { data: popularData, error: popularError } = await supabase
        .from("popular_products")
        .select("product_id");

      if (popularError) throw popularError;

      if (popularData && popularData.length > 0) {
        // Extract product IDs
        const productIds = popularData.map((item) => item.product_id);
        
        // Fetch the actual products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (productsError) throw productsError;

        if (productsData) {
          // Process products data
          const processedProducts = productsData.map((product: Product) => {
            // Parse JSON pricing if stored as string
            const pricingWithoutPrint = typeof product.pricing_without_print === 'string' 
              ? JSON.parse(product.pricing_without_print as string)
              : product.pricing_without_print;
            
            // Calculate starting price
            const priceValues = Object.values(pricingWithoutPrint as Record<string, number>);
            const startingPrice = priceValues.length > 0 
              ? Math.min(...(priceValues as number[])) 
              : 0;
            
            // Map product type to category
            let category: string;
            switch (product.type) {
              case "cotton_bag": category = "cotton"; break;
              case "paper_bag": category = "paper"; break;
              case "drawstring_bag": category = "drawstring"; break;
              case "packaging_box": category = "packaging"; break;
              default: category = "other";
            }
            
            return {
              id: product.id,
              name: product.name,
              description: product.description || "",
              image: product.image_url || "/placeholder.svg",
              category,
              startingPrice,
            };
          });
          
          setPopularProducts(processedProducts);
        }
      }
    } catch (error) {
      console.error("Error fetching popular products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentData = async () => {
    try {
      const { data, error } = await supabase
        .from("website_content")
        .select("*")
        .eq("page", "home");

      if (error) throw error;

      if (data && data.length > 0) {
        const content: any = {};
        data.forEach((item) => {
          content[item.key] = item.value;
        });

        setContentData({
          hero_title: content.hero_title || "Custom Printed Bags for Your Business",
          hero_subtitle: content.hero_subtitle || "High-quality cotton, paper, and drawstring bags with your brand",
          about_title: content.about_title || "About Us",
          about_text: content.about_text || "We offer sustainable and customizable packaging solutions for businesses of all sizes.",
        });
      }
    } catch (error) {
      console.error("Error fetching content data:", error);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{contentData.hero_title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {contentData.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-600">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Popular Products</h2>
          <p className="text-gray-600 text-center mb-8">
            Our most popular custom bag and packaging options
          </p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : popularProducts.length > 0 ? (
            <>
              <ProductGrid products={popularProducts} />
              <div className="text-center mt-10">
                <Button asChild variant="outline">
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No popular products found</p>
              <Button asChild variant="outline">
                <Link to="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{contentData.about_title}</h2>
            <p className="text-gray-600 mb-6">
              {contentData.about_text}
            </p>
            <Button asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
