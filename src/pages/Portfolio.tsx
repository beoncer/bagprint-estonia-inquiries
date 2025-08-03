
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Eye, ExternalLink, Filter, X } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  tags?: string;
  created_at: string;
}

const fetchPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('visible', true)
    .order('order', { ascending: true });

  if (error) throw error;
  return data || [];
};

const Portfolio = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  
  // Dynamic content state
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [achievementsTitle, setAchievementsTitle] = useState("");
  const [achievementsDescription, setAchievementsDescription] = useState("");
  const [achievements, setAchievements] = useState<Array<{value: string, label: string}>>([]);
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
          setAchievementsTitle(data.find((row: any) => row.key === "portfolio_achievements_title")?.value || "");
          setAchievementsDescription(data.find((row: any) => row.key === "portfolio_achievements_description")?.value || "");
          
          // Fetch achievements
          const achArr = [];
          for (let i = 1; i <= 6; i++) {
            const value = data.find((row: any) => row.key === `portfolio_achievement_${i}_value`)?.value || "";
            const label = data.find((row: any) => row.key === `portfolio_achievement_${i}_label`)?.value || "";
            if (value || label) achArr.push({ value, label });
          }
          setAchievements(achArr);
          
          setCtaTitle(data.find((row: any) => row.key === "portfolio_cta_title")?.value || "");
          setCtaSubtitle(data.find((row: any) => row.key === "portfolio_cta_text")?.value || "");
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 break-words">
              {headerHighlight && header.includes(headerHighlight) ? (
                <>
                  {header.split(headerHighlight)[0]}
                  <span className="text-primary">{headerHighlight}</span>
                  {header.split(headerHighlight)[1]}
                </>
              ) : (header || "Portfoolio")}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 break-words">
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
          {[...new Set(portfolioItems.map(item => item.category).filter(Boolean))].map((category) => (
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
                <div className="relative cursor-pointer" onClick={() => setSelectedImage(item)}>
                  <OptimizedImage
                    src={item.image_url || '/placeholder.svg'}
                    alt={item.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    width={600}
                    height={300}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge>{item.category || 'Üldine'}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                    <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 break-words">{item.title}</h2>
                  {item.description && (
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  )}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.split(',').map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedImage(item)}
                    className="w-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Vaata pilti
                  </Button>
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

        {/* Achievements Section */}
        {achievementsTitle && achievements.length > 0 && (
          <section className="bg-white py-12 md:py-16 px-6 md:px-8 rounded-lg mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 break-words">{achievementsTitle}</h2>
              {achievementsDescription && (
                <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed break-words">
                  {achievementsDescription}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{achievement.value}</div>
                  <div className="text-gray-600 font-medium">{achievement.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        {ctaTitle && (
          <section className="bg-primary text-white py-12 md:py-16 px-6 md:px-8 rounded-lg mt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 break-words">{ctaTitle}</h2>
            {ctaSubtitle && (
              <p className="text-white text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed break-words">
                {ctaSubtitle}
              </p>
            )}
            {ctaButton && (
              <Button variant="secondary" size="lg" className="text-sm md:text-base">
                {ctaButton}
              </Button>
            )}
          </section>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
              <OptimizedImage
                src={selectedImage.image_url || '/placeholder.svg'}
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain"
                width={1200}
                height={800}
              />
              <div className="p-6 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{selectedImage.category || 'Üldine'}</Badge>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                )}
                {selectedImage.tags && (
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.split(',').map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Portfolio;
