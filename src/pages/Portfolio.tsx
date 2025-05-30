
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock portfolio data - in a real app, this would come from Supabase
const portfolioItems = [
  {
    id: 1,
    title: "Restoran Noa puuvillakotid",
    category: "riidest-kotid",
    image: "/placeholder.svg",
    description: "Elegantsed puuvillakotid restoranile Noa, mis rõhutavad brändi kvaliteeti ja stiili.",
    tags: ["Puuvill", "Logo trükk", "Premium"],
  },
  {
    id: 2,
    title: "IT-ettevõtte paberkotid",
    category: "paberkotid",
    image: "/placeholder.svg",
    description: "Minimalistlikud paberkotid IT-ettevõttele konverentside ja ürituste jaoks.",
    tags: ["Kraft paber", "Minimalism", "Öko"],
  },
  {
    id: 3,
    title: "Spordiklubi paelaga kotid",
    category: "nooriga-kotid",
    image: "/placeholder.svg",
    description: "Praktilised paelaga kotid spordiklubile, mis sobivad igapäevaseks kasutamiseks.",
    tags: ["Sport", "Värviline", "Praktiline"],
  },
  {
    id: 4,
    title: "Hotelli sussikotid",
    category: "sussikotid",
    image: "/placeholder.svg",
    description: "Luksuslikud sussikotid hotellile, mis pakuvad külalistele mugavust.",
    tags: ["Hotell", "Premium", "Mugav"],
  },
  {
    id: 5,
    title: "Raamatupoodi kotid",
    category: "riidest-kotid",
    image: "/placeholder.svg",
    description: "Tugevad puuvillakotid raamatupoe klientidele, mis kannavad raskeid raamatuid.",
    tags: ["Tugev", "Raamatud", "Vastupidav"],
  },
  {
    id: 6,
    title: "Kohviku paberkotid",
    category: "paberkotid",
    image: "/placeholder.svg",
    description: "Sõbralikud paberkotid kohvikule, mis rõhutavad kohaliku äri tähtsust.",
    tags: ["Kohvik", "Kohalik", "Sõbralik"],
  },
];

const categories = [
  { id: "all", name: "Kõik projektid", slug: "all" },
  { id: "riidest-kotid", name: "Riidest kotid", slug: "riidest-kotid" },
  { id: "paberkotid", name: "Paberkotid", slug: "paberkotid" },
  { id: "nooriga-kotid", name: "Paelaga kotid", slug: "nooriga-kotid" },
  { id: "sussikotid", name: "Sussikotid", slug: "sussikotid" },
];

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems = portfolioItems.filter(item => 
    activeFilter === "all" || item.category === activeFilter
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image}
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
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          Vaata detaile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
      </div>
    </div>
  );
};

export default Portfolio;
