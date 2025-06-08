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

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Meie <span className="text-primary">portfoolio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tutvu meie valmistatud kottidega erinevate ettevõtete jaoks. 
            Iga projekt on unikaalne ja peegeldab kliendi brändi ning vajadusi.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-gray-100">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="py-3 px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags && item.tags.split(",").map((tag) => (
                              <Badge
                                key={tag.trim()}
                                variant="secondary"
                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
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
        <div className="bg-white rounded-3xl shadow-xl p-12 mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meie saavutused</h2>
            <p className="text-lg text-gray-600">Numbrid, mis räägivad meie kogemusest</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-gray-600">Lõpetatud projekti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Rahulolev klient</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-gray-600">Tootekategooriat</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-gray-600">Kliendirahulolu</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Valmis oma projekti alustama?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
            Küsi pakkumist
          </Button>
        </div>

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
