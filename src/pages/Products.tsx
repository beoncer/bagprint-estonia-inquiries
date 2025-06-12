
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(category || "all");

  const categories = [
    { id: "all", name: "Kõik tooted", count: 45 },
    { id: "cotton", name: "Riidest kotid", count: 15 },
    { id: "paper", name: "Paberkotid", count: 12 },
    { id: "drawstring", name: "Nööriga kotid", count: 10 },
    { id: "shoe", name: "Sussikotid", count: 8 },
  ];

  const featuredPosts = [
    {
      title: "Kuidas valida õiget kotti oma brändile",
      excerpt: "Praktilised nõuanded sobiva koti valimiseks, mis esindab teie brändi parimail võimalikult.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
      readTime: "5 min"
    },
    {
      title: "Ökoloogilised pakendilahendused",
      excerpt: "Miks on oluline valida keskkonnasõbralikke pakendeid ja kuidas see mõjutab teie brändi mainet.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
      readTime: "3 min"
    },
    {
      title: "Trükikvaliteedi saladused",
      excerpt: "Millised on parimad praktikad kvaliteetse logo ja disaini trükkimiseks kottidele.",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop",
      readTime: "4 min"
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Hero Section - matching portfolio style */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Meie <span className="text-primary">tooted</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Avasta meie laia valikut kvaliteetseid kotte ja pakendeid. Kõik tooted on saadaval kohandatud trükiga, mis aitab sinu brändi silma paista.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-center gap-2"
                >
                  {cat.name}
                  <span className="text-sm opacity-70">({cat.count})</span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <ProductGrid category={selectedCategory === "all" ? undefined : selectedCategory} />
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Kasulikud artiklid</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Loe meie eksperdijuhendeid ja nõuandeid, mis aitavad sul teha parimaid valikuid
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                      <Star className="w-4 h-4 ml-4 mr-1 text-yellow-500" />
                      Populaarne
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Products;
