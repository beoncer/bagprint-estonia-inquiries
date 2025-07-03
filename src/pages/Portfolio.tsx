
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Eye, ExternalLink, Filter } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  website_url?: string;
  details_url?: string;
  created_at: string;
}

const fetchPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const Portfolio = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  
  // Dynamic content state
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaSubtitle, setCtaSubtitle] = useState("");
  const [ctaButton, setCtaButton] = useState("");

  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: fetchPortfolioItems,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch dynamic content with proper dependency array and cleanup
  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const { data } = await supabase
          .from("website_content")
          .select("key, value")
          .eq("page", "portfolio");
        
        if (data && mounted) {
          setHeader(data.find((row: any) => row.key === "portfolio_header")?.value || "");
          setHeaderHighlight(data.find((row: any) => row.key === "portfolio_header_highlight")?.value || "");
          setDescription(data.find((row: any) => row.key === "portfolio_description")?.value || "");
          setCtaTitle(data.find((row: any) => row.key === "portfolio_cta_title")?.value || "");
          setCtaSubtitle(data.find((row: any) => row.key === "portfolio_cta_subtitle")?.value || "");
          setCtaButton(data.find((row: any) => row.key === "portfolio_cta_button")?.value || "");
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(portfolioItems);
    } else {
      const filtered = portfolioItems.filter(item => item.category === categoryFilter);
      setFilteredItems(filtered);
    }
  }, [categoryFilter, portfolioItems]);

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Viga</h2>
          <p className="text-red-600 mb-8">Portfoolio elemente ei õnnestunud laadida. Palun proovige hiljem uuesti.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mb-6">
          <Breadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 break-words">
              {headerHighlight && header.includes(headerHighlight) ? (
                <>
                  {header.split(headerHighlight)[0]}
                  <span className="text-primary">{headerHighlight}</span>
                  {header.split(headerHighlight)[1]}
                </>
              ) : (header || "Portfoolio")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 break-words">
              {description || "Vaadake meie tehtud töid ja projekte"}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            onClick={() => handleCategoryFilter("all")}
          >
            <Filter className="mr-2 h-4 w-4" />
            Kõik
          </Button>
          {[...new Set(portfolioItems.map(item => item.category))].map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <OptimizedImage
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    width={600}
                    height={300}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge>{item.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 break-words">{item.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.website_url && (
                      <Button asChild variant="outline" size="sm">
                        <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Veebileht
                        </a>
                      </Button>
                    )}
                    {item.details_url && (
                      <Button asChild variant="outline" size="sm">
                        <a href={item.details_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Vaata lähemalt
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">Portfoolio elemente ei leitud</h3>
            <p className="text-gray-600 mb-6">Proovige muuta filtrit</p>
            <Button onClick={() => setCategoryFilter("all")}>
              Näita kõiki
            </Button>
          </div>
        )}

        {/* CTA Section */}
        {ctaTitle && (
          <section className="bg-primary text-white py-12 md:py-16 px-6 md:px-8 rounded-lg mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4 break-words">{ctaTitle}</h2>
            {ctaSubtitle && <h3 className="text-2xl font-medium mb-6 md:mb-8 break-words">{ctaSubtitle}</h3>}
            {ctaButton && (
              <Button variant="secondary" size="lg">
                {ctaButton}
              </Button>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
