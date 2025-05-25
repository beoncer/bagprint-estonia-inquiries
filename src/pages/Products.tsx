import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, ChevronDown, Camera, Shield, Smile, Briefcase, Gift, Truck } from "lucide-react";
import { getProducts, Product, getSiteContent } from "@/lib/supabase";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";

const categories = [
  { id: "all", name: "Kõik tooted" },
  { id: "cotton_bag", name: "Puuvillakotid" },
  { id: "paper_bag", name: "Paberkotid" },
  { id: "drawstring_bag", name: "Paelaga kotid" },
  { id: "packaging", name: "E-poe pakendid" },
];

const categoryPathMap: Record<string, string> = {
  "/riidest-kotid": "cotton_bag",
  "/paberkotid": "paper_bag",
  "/nooriga-kotid": "drawstring_bag",
  "/sussikotid": "shoebag",
  "/tooted": "all",
};

const categoryPrettyUrlMap: Record<string, string> = {
  all: "/tooted",
  cotton_bag: "/riidest-kotid",
  paper_bag: "/paberkotid",
  drawstring_bag: "/nooriga-kotid",
  shoebag: "/sussikotid",
};

const blogArticles = [
  {
    id: 1,
    title: "Kuidas valida õiget kotti oma brändile",
    excerpt: "Praktilised nõuanded sobiva koti valimiseks, mis esindab teie brändi parimatel võimalikult.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Ökoloogilised pakendilahendused",
    excerpt: "Miks on oluline valida keskkonnasõbralikke pakendeid ja kuidas see mõjutab teie brändi mainet.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    readTime: "3 min"
  },
  {
    id: 3,
    title: "Trükikvaliteedi saladused",
    excerpt: "Millised on parimad praktikad kvaliteetse logo ja disaini trükkimiseks kottidele.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop",
    readTime: "4 min"
  }
];

const categoryFAQs = {
  cotton_bag: [
    {
      question: "Millised on puuvillakottide peamised eelised?",
      answer: "Puuvillakotid on keskkonnasõbralikud, vastupidavad ja korduvkasutatavad. Need sobivad hästi igapäevaseks kasutamiseks ja on ideaalsed brändi reklaamimiseks."
    },
    {
      question: "Kas puuvillakotte saab pesta?",
      answer: "Jah, puuvillakotte saab pesta masinpesu või käsitsi. Soovitame kasutada külma vett ja õrna pesuvahendi, et säilitada koti kvaliteet ja trükk."
    },
    {
      question: "Millised trükimeetodid sobivad puuvillakottidele?",
      answer: "Puuvillakottidele sobivad hästi siittrükk, termotransfer ja brodeeritus. Valime parima meetodi sõltuvalt disainist ja kogusest."
    },
    {
      question: "Kui kaua kestab puuvillakottide tellimine?",
      answer: "Tavaline tarneaeg on 7-14 tööpäeva, sõltuvalt kogusest ja trüki keerukusest. Kiireloomuliste tellimuste puhul võime pakkuda kiiremat täitmist."
    },
    {
      question: "Mis on minimaalne tellimiskogus?",
      answer: "Minimaalne tellimiskogus sõltub toote tüübist ja trükimeetodist. Tavaliselt alates 50 tükist, kuid võime arutada ka väiksemaid koguseid."
    }
  ],
  paper_bag: [
    {
      question: "Millised paberkotid on kõige vastupidavamad?",
      answer: "Kraft-paberkotid on kõige vastupidavamad ja sobivad hästi raskete esemete kandmiseks. Need on valmistatud kvaliteetsest paksust paberist."
    },
    {
      question: "Kas paberkotid on keskkonnasõbralikud?",
      answer: "Jah, meie paberkotid on valmistatud taaskasutatud materjalist ja on täielikult lagunevad. Need on suurepärane keskkonnasõbralik alternatiiv plastikkottidele."
    },
    {
      question: "Millised trükimeetodid sobivad paberkottidele?",
      answer: "Paberkottidele sobivad fleksotükk, digitaaltrükk ja tempel. Valime parima meetodi sõltuvalt koti tüübist ja disainist."
    },
    {
      question: "Kas paberkotte saab personaliseerida?",
      answer: "Jah, pakume täielikku personaliseerimist - logod, tekstid, värvid ja isegi erikujulised aknad. Saame luua unikaalse disaini teie brändile."
    },
    {
      question: "Millised on paberkottide hoiutingimused?",
      answer: "Paberkotte tuleks hoida kuivas kohas, kaitstuna niiskuse eest. Õige hoiustamise korral säilivad need pikka aega oma kvaliteeti."
    }
  ],
  drawstring_bag: [
    {
      question: "Milleks sobivad nööriga kotid kõige paremini?",
      answer: "Nööriga kotid sobivad suurepäraselt spordivahendite, jalanõude, rõivaste ja väikeste esemete hoiustamiseks. Need on mugavad seljakotina kandmiseks."
    },
    {
      question: "Millised materjalid on saadaval?",
      answer: "Pakume nööriga kotte erinevatest materjalidest: puuvill, polüester, nonwoven ja jute. Iga materjal omab erinevaid omadusi ja hinda."
    },
    {
      question: "Kas nöörid on reguleeritavad?",
      answer: "Jah, enamik meie nööriga kotte on varustatud reguleeritavate nööridega, mis muudab kandmise mugavamaks ja võimaldab kohandada seljarihma pikkust."
    },
    {
      question: "Millised on trükivõimalused nööriga kottidel?",
      answer: "Pakume siittrükki, termotransferit ja brodeeritust. Trükiala sõltub koti suurusest, kuid tavaliselt saab trükkida nii ees- kui tagaküljele."
    },
    {
      question: "Kas nööriga kotid sobivad lastele?",
      answer: "Jah, nööriga kotid on suurepärane valik lastele - need on kerged, ohutud ja lihtsad kasutada. Saadaval erinevates värvides ja suurustes."
    }
  ],
  shoebag: [
    {
      question: "Milleks on sussikotid mõeldud?",
      answer: "Sussikotid on spetsiaalselt mõeldud jalanõude hoiustamiseks ja transportimiseks. Need kaitsevad teisi esemeid mustuse eest ja hoiavad sussid eraldi."
    },
    {
      question: "Millised suurused on saadaval?",
      answer: "Pakume erinevaid suurusi alates laste jalanõudest kuni suure mehe sussideni. Saadaval ka eritellimusel vastavalt teie vajadustele."
    },
    {
      question: "Kas sussikotid on hingavad?",
      answer: "Jah, meie sussikotid on valmistatud hingavatest materjalidest, mis võimaldavad õhuringlust ja takistavad ebameeldiva lõhna tekkimist."
    },
    {
      question: "Kas sussikotte saab pesta?",
      answer: "Enamikku sussikotte saab pesta masinpesu või käsitsi. Soovitame kontrollida pesujuhendit igal kindlal koti tüübil."
    },
    {
      question: "Millised on personaliseerimise võimalused?",
      answer: "Saame trükkida logosid, nimesid või muid tekste. Sussikotid sobivad hästi spordiklubidele, hotellidele ja isikliku kasutuse jaoks."
    }
  ]
};

const guarantees = [
  {
    icon: Camera,
    title: "Garanteerime parima hinna",
    description: "Konkurentsivõimeline hinnapoliitika ja parimad pakkumised turul"
  },
  {
    icon: Shield,
    title: "Garanteerime hea kvaliteedi", 
    description: "Kasutame ainult kvaliteetseid materjale ja kontrollitud tootmisprotsesse"
  },
  {
    icon: Smile,
    title: "Garanteerime rahulolu",
    description: "Tagame klientide rahulolu ja professionaalse teeninduse"
  },
  {
    icon: Briefcase,
    title: "Garanteerime personaalse teeninduse",
    description: "Individuaalne lähenemine ja personaalne nõustamine igale kliendile"
  },
  {
    icon: Gift,
    title: "Garanteerime näidised",
    description: "Pakume tootenäidiseid, et saaksite kvaliteedis veenduda"
  },
  {
    icon: Truck,
    title: "Garanteerime õigeaegse kohaletoimetamise",
    description: "Täpsed tarneajad ja usaldusväärne logistika"
  }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  // Fetch site content for dynamic product categories
  const { data: siteContent, isLoading: siteContentLoading, error: siteContentError } = useQuery({
    queryKey: ['site-content'],
    queryFn: getSiteContent,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  console.log('Site content query - Loading:', siteContentLoading, 'Error:', siteContentError, 'Data:', siteContent);

  // Create dynamic product categories from site content - only when data is available
  const productCategories = siteContent ? [
    {
      id: "cotton_bag",
      name: "Riidest kotid",
      image: siteContent.product_category_1_image || "https://images.unsplash.com/photo-1607166452147-3a432d381111?w=800&auto=format&fit=crop",
      link: "/riidest-kotid"
    },
    {
      id: "paper_bag", 
      name: "Paberkotid",
      image: siteContent.product_category_2_image || "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&auto=format&fit=crop",
      link: "/paberkotid"
    },
    {
      id: "drawstring_bag",
      name: "Nööriga kotid", 
      image: siteContent.product_category_3_image || "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop",
      link: "/nooriga-kotid"
    },
    {
      id: "shoebag",
      name: "Sussikotid",
      image: siteContent.product_category_4_image || "https://images.unsplash.com/photo-1605040742661-bbb75bc29d9a?w=800&auto=format&fit=crop", 
      link: "/sussikotid"
    }
  ] : [
    // Fallback categories while loading
    {
      id: "cotton_bag",
      name: "Riidest kotid",
      image: "https://images.unsplash.com/photo-1607166452147-3a432d381111?w=800&auto=format&fit=crop",
      link: "/riidest-kotid"
    },
    {
      id: "paper_bag", 
      name: "Paberkotid",
      image: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&auto=format&fit=crop",
      link: "/paberkotid"
    },
    {
      id: "drawstring_bag",
      name: "Nööriga kotid", 
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop",
      link: "/nooriga-kotid"
    },
    {
      id: "shoebag",
      name: "Sussikotid",
      image: "https://images.unsplash.com/photo-1605040742661-bbb75bc29d9a?w=800&auto=format&fit=crop", 
      link: "/sussikotid"
    }
  ];

  console.log('Final product categories:', productCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    image: cat.image,
    isFromSupabase: cat.image && !cat.image.includes('unsplash.com')
  })));
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Handle category filtering from URL params
  useEffect(() => {
    const path = location.pathname;
    let categoryFromPath = categoryPathMap[path];
    if (!categoryFromPath) {
      // fallback to query param logic
      const categoryFromUrl = searchParams.get("category");
      categoryFromPath = categoryFromUrl || "all";
    }
    setActiveCategory(categoryFromPath);
  }, [location.pathname, searchParams]);
  
  // Apply filters when category or search term changes
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (activeCategory !== "all") {
      console.log(`Filtering by category: ${activeCategory}`);
      result = result.filter(product => product.category === activeCategory);
      console.log(`After category filter: ${result.length} products`);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      console.log(`Filtering by search term: ${searchLower}`);
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
      console.log(`After search filter: ${result.length} products`);
    }
    
    console.log("Filtered products:", result);
    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);
  
  const handleCategoryChange = (categoryId: string) => {
    console.log("Category changed to:", categoryId);
    if (categoryId === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
    setActiveCategory(categoryId);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with term:", searchTerm);
  };
  
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-600 mb-8">{error}</p>
          <Button onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  // Show category listing only for /tooted page
  if (location.pathname === "/tooted") {
    return (
      <Layout>
        <div className="bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Meie tooted</h1>
            <p className="text-gray-600 mb-8">
              Sirvige laia valikut kotte ja pakendeid, mida saate kohandada vastavalt oma brändi vajadustele.
            </p>

            {/* Product Categories Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Tootekategooriad</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {productCategories.map((category) => (
                  <Link key={category.id} to={category.link} className="text-center group">
                    <div className="h-60 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all group-hover:scale-105"
                        onError={(e) => {
                          console.log(`Image error for category ${category.id}`);
                          console.log(`Failed image URL: ${category.image}`);
                          console.log('Falling back to default image');
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607166452147-3a432d381111?w=800&auto=format&fit=crop";
                        }}
                        onLoad={() => {
                          console.log(`Image loaded successfully for category ${category.id}: ${category.image}`);
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Button variant="link" className="p-0">
                      Vaata tooteid
                    </Button>
                  </Link>
                ))}
              </div>
            </section>

            {/* Guarantees Section */}
            <section className="mb-16">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">Rahuloleva Kliendi Garantii</h2>
                  <p className="text-gray-600 max-w-4xl mx-auto">
                    Kinkekott.ee seame teie kui kliendi meeleirahu esikohale. Tagame, et trükiga reklaamtoodete tellimise protsess on sujuv ja probleemideta. Alates tootesoovisuste pakkumisest kuni lõpptoodete kohaletoimetamiseni hoolitseme kõikide aspektide eest, et teie kogemust lihtsustada.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {guarantees.map((guarantee, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                        <guarantee.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{guarantee.title}</h3>
                        <p className="text-gray-600 text-sm">{guarantee.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Blog Articles Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Kasulikud artiklid</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{article.readTime} lugemist</span>
                        <Button variant="link" size="sm" className="p-0">
                          Loe edasi
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Layout>
    );
  }

  // Show filtered products for category pages
  const categoryTitle = {
    cotton_bag: "Riidest kotid",
    paper_bag: "Paberkotid", 
    drawstring_bag: "Nööriga kotid",
    shoebag: "Sussikotid"
  }[activeCategory] || "Tooted";

  const categoryDescription = {
    cotton_bag: "riidest kottide",
    paper_bag: "paberkottide",
    drawstring_bag: "nööriga kottide", 
    shoebag: "sussikottide"
  }[activeCategory] || "toodete";

  return (
    <Layout>
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">{categoryTitle}</h1>
          <p className="text-gray-600 mb-8">
            Vaata meie {categoryDescription} valikut.
          </p>
          
          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
            <div className="w-full md:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Otsi tooteid..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </form>
            </div>
          </div>
          
          {/* Results */}
          {filteredProducts.length > 0 ? (
            <>
              <p className="mb-6">Leitud {filteredProducts.length} toodet</p>
              <ProductGrid products={filteredProducts} />
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Tooteid ei leitud</h3>
              <p className="text-gray-600 mb-6">Proovige muuta otsingufiltrit või sirvige kõiki tooteid</p>
              <Button onClick={() => {
                setSearchTerm("");
                handleCategoryChange("all");
              }}>
                Näita kõiki tooteid
              </Button>
            </div>
          )}

          {/* Guarantees Section */}
          <section className="mt-16 mb-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Rahuloleva Kliendi Garantii</h2>
                <p className="text-gray-600 max-w-4xl mx-auto">
                  Kinkekott.ee seame teie kui kliendi meeleirahu esikohale. Tagame, et trükiga reklaamtoodete tellimise protsess on sujuv ja probleemideta. Alates tootesoovisuste pakkumisest kuni lõpptoodete kohaletoimetamiseni hoolitseme kõikide aspektide eest, et teie kogemust lihtsustada.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guarantees.map((guarantee, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <guarantee.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{guarantee.title}</h3>
                      <p className="text-gray-600 text-sm">{guarantee.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Need Help Section */}
          <section className="bg-primary text-white py-16 px-8 rounded-lg mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Küsimusi?</h2>
            <h3 className="text-2xl font-medium mb-8">Aitame teid rõõmuga!</h3>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold">+372 5919 7172</div>
                  <div className="text-sm opacity-90">Ootame kõnet tööpäeviti 9.00-17.00</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold">Vajad abi?</div>
                  <div className="text-sm opacity-90">Võtke meiega ühendust e-posti teel</div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16 mb-16">
            <h2 className="text-2xl font-bold mb-8">Tellimisprotsess</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Accordion type="single" collapsible className="w-full">
                {categoryFAQs[activeCategory as keyof typeof categoryFAQs]?.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-b-0">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
