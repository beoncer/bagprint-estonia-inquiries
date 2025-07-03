
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
  tags: string; // comma separated
}

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Dynamic content state
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [achievementsTitle, setAchievementsTitle] = useState("");
  const [achievementsDescription, setAchievementsDescription] = useState("");
  const [achievements, setAchievements] = useState<{ value: string; label: string }[]>([]);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaButton, setCtaButton] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolio")
        .select("id, title, category, image_url, description, tags")
        .eq("visible", true)
        .order("order", { ascending: true });
      if (!error && data) setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "portfolio");
      if (data) {
        setHeader(data.find((row: any) => row.key === "portfolio_header")?.value || "");
        setHeaderHighlight(data.find((row: any) => row.key === "portfolio_header_highlight")?.value || "");
        setDescription(data.find((row: any) => row.key === "portfolio_description")?.value || "");
        setAchievementsTitle(data.find((row: any) => row.key === "portfolio_achievements_title")?.value || "");
        setAchievementsDescription(data.find((row: any) => row.key === "portfolio_achievements_description")?.value || "");
        // Achievements
        const achArr = [];
        for (let i = 1; i <= 6; i++) {
          const value = data.find((row: any) => row.key === `portfolio_achievement_${i}_value`)?.value || "";
          const label = data.find((row: any) => row.key === `portfolio_achievement_${i}_label`)?.value || "";
          if (value || label) achArr.push({ value, label });
        }
        setAchievements(achArr);
        setCtaTitle(data.find((row: any) => row.key === "portfolio_cta_title")?.value || "");
        setCtaText(data.find((row: any) => row.key === "portfolio_cta_text")?.value || "");
        setCtaButton(data.find((row: any) => row.key === "portfolio_cta_button")?.value || "");
      }
    };
    fetchContent();
  }, []);

  if (loading || !header) {
    return <div className="py-32 text-center text-gray-500">Laadimine...</div>;
  }

  // Get unique categories from data
  const categories = [
    { id: "all", name: "Kõik projektid", slug: "all" },
    ...Array.from(
      new Map(
        items.map((item) => [item.category, { id: item.category, name: item.category, slug: item.category }])
      ).values()
    ),
  ];

  const filteredItems = items.filter(
    (item) => activeFilter === "all" || item.category === activeFilter
  );

  // Get grid class based on number of categories
  const getGridClass = () => {
    if (categories.length <= 2) return "grid-cols-2";
    if (categories.length <= 3) return "grid-cols-3";
    if (categories.length <= 4) return "grid-cols-2 md:grid-cols-4";
    return "grid-cols-2 md:grid-cols-5";
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-12 md:py-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 break-words">
            {headerHighlight && header.includes(headerHighlight) ? (
              <>
                {header.split(headerHighlight)[0]}
                <span className="text-primary">{headerHighlight}</span>
                {header.split(headerHighlight)[1]}
              </>
            ) : header}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {description}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className={`grid w-full ${getGridClass()} h-auto p-1 bg-gray-100`}>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all break-words"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Portfolio Grid */}
            <div className="mt-12">
              <TabsContent value={activeFilter} className="m-0">
                {loading ? (
                  <div className="text-center py-12 text-gray-400">Laadimine...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="relative overflow-hidden cursor-zoom-in" onClick={() => setZoomedImage(item.image_url || "/placeholder.svg") }>
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors break-words">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags && item.tags.split(",").map((tag) => (
                              <Badge
                                key={tag.trim()}
                                variant="secondary"
                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs"
                              >
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Stats Section */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mt-16 md:mt-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 break-words">{achievementsTitle}</h2>
              <p className="text-xl text-gray-600 break-words">{achievementsDescription}</p>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-${Math.min(achievements.length, 4)} gap-6 md:gap-8`}>
              {achievements.map((a, idx) => (
                <div className="text-center" key={idx}>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 break-words">{a.value}</div>
                  <div className="text-gray-600 text-lg break-words">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {ctaTitle && (
          <div className="text-center mt-16 md:mt-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 md:mb-6 break-words">
              {ctaTitle}
            </h2>
            <p className="text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto break-words px-4">
              {ctaText}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-2 md:py-3 text-lg">
              {ctaButton}
            </Button>
          </div>
        )}

        {/* Image Zoom Modal */}
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-2xl flex flex-col items-center">
            {zoomedImage && (
              <img src={zoomedImage} alt="Zoomed" className="w-full h-auto rounded-lg" />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Portfolio;
