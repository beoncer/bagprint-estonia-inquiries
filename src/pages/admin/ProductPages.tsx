import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface ProductPageContent {
  id: string;
  title: string;
  description: string;
  highlight: string;
  seoTitle?: string;
  seoDescription?: string;
  faqs: FAQ[];
}

const ProductPagesAdmin: React.FC = () => {
  const [productPages, setProductPages] = useState<ProductPageContent[]>([
    {
      id: "cotton_bag",
      title: "Riidest kotid",
      description: "Vaata meie riidest kottide valikut.",
      highlight: "kotid",
      seoTitle: "Riidest kotid - Kvaliteetsed puuvillakotid",
      seoDescription: "Ostke kvaliteetsed riidest kotid. Suur valik, kiire tarne, soodne hind.",
      faqs: [
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
      ]
    },
    {
      id: "paper_bag",
      title: "Paberkotid",
      description: "Vaata meie paberkottide valikut.",
      highlight: "kotid",
      seoTitle: "Paberkotid - Keskkonnasõbralikud pakendid",
      seoDescription: "Keskkonnasõbralikud paberkotid teie brändile. Taaskasutatud materjal.",
      faqs: [
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
      ]
    },
    {
      id: "drawstring_bag",
      title: "Nööriga kotid",
      description: "Vaata meie nööriga kottide valikut.",
      highlight: "kotid",
      seoTitle: "Nööriga kotid - Mugavad seljakotid",
      seoDescription: "Mugavad nööriga kotid spordivahenditele ja väikestele esemetele.",
      faqs: [
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
      ]
    },
    {
      id: "shoebag",
      title: "Sussikotid",
      description: "Vaata meie sussikottide valikut.",
      highlight: "kotid",
      seoTitle: "Sussikotid - Jalanõude hoiustamine",
      seoDescription: "Hingavad sussikotid jalanõude hoiustamiseks ja transportimiseks.",
      faqs: [
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
        const updatedPages = productPages.map(page => {
          // Get FAQs for this page
          const pageFaqs = data
            .filter((row: any) => row.key.startsWith(`${page.id}_faq_`))
            .reduce((acc: FAQ[], row: any) => {
              const faqIndex = parseInt(row.key.split('_')[2]);
              const isQuestion = row.key.endsWith('_question');
              const existingFaq = acc[faqIndex] || { question: '', answer: '' };
              
              if (isQuestion) {
                existingFaq.question = row.value;
              } else {
                existingFaq.answer = row.value;
              }
              
              acc[faqIndex] = existingFaq;
              return acc;
            }, [])
            .filter(faq => faq.question && faq.answer); // Remove incomplete FAQs

          return {
            ...page,
            title: data.find((row: any) => row.key === `${page.id}_title`)?.value || page.title,
            description: data.find((row: any) => row.key === `${page.id}_description`)?.value || page.description,
            highlight: data.find((row: any) => row.key === `${page.id}_highlight`)?.value || page.highlight,
            seoTitle: data.find((row: any) => row.key === `${page.id}_seo_title`)?.value || page.seoTitle,
            seoDescription: data.find((row: any) => row.key === `${page.id}_seo_description`)?.value || page.seoDescription,
            faqs: pageFaqs.length > 0 ? pageFaqs : page.faqs
          };
        });
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
      // Add FAQ updates
      ...page.faqs.flatMap((faq, index) => [
        { page: "product_pages", key: `${page.id}_faq_${index}_question`, value: faq.question },
        { page: "product_pages", key: `${page.id}_faq_${index}_answer`, value: faq.answer }
      ])
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

  // Add FAQ management functions
  const handleFAQChange = (pageId: string, faqIndex: number, field: keyof FAQ, value: string) => {
    setProductPages(prev => prev.map(page => 
      page.id === pageId ? {
        ...page,
        faqs: page.faqs.map((faq, idx) => 
          idx === faqIndex ? { ...faq, [field]: value } : faq
        )
      } : page
    ));
  };

  const handleAddFAQ = (pageId: string) => {
    setProductPages(prev => prev.map(page => 
      page.id === pageId ? {
        ...page,
        faqs: [...page.faqs, { question: '', answer: '' }]
      } : page
    ));
  };

  const handleRemoveFAQ = (pageId: string, faqIndex: number) => {
    setProductPages(prev => prev.map(page => 
      page.id === pageId ? {
        ...page,
        faqs: page.faqs.filter((_, idx) => idx !== faqIndex)
      } : page
    ));
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

            {/* FAQ Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">KKK (Korduma Kippuvad Küsimused)</h4>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddFAQ(page.id)}
                  disabled={contentLoading || contentSaving}
                >
                  Lisa uus KKK
                </Button>
              </div>
              
              <div className="space-y-4">
                {page.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border rounded p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">KKK #{faqIndex + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveFAQ(page.id, faqIndex)}
                        disabled={contentLoading || contentSaving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Küsimus</label>
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2"
                          value={faq.question}
                          onChange={e => handleFAQChange(page.id, faqIndex, "question", e.target.value)}
                          disabled={contentLoading || contentSaving}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Vastus</label>
                        <textarea
                          className="w-full border rounded px-3 py-2"
                          rows={3}
                          value={faq.answer}
                          onChange={e => handleFAQChange(page.id, faqIndex, "answer", e.target.value)}
                          disabled={contentLoading || contentSaving}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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