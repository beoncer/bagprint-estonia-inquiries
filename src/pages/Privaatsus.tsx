import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const Privaatsus: React.FC = () => {
  const [title, setTitle] = useState("Privaatsuspoliitika");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      // Fetch page title
      const { data: titleData } = await supabase
        .from("website_content")
        .select("value")
        .eq("page", "privaatsus")
        .eq("key", "privaatsus_page_title")
        .maybeSingle();

      if (titleData) {
        setTitle(titleData.value);
      }

      // Fetch page content
      const { data: contentData } = await supabase
        .from("website_content")
        .select("value")
        .eq("page", "privaatsus")
        .eq("key", "privaatsus_page_content")
        .maybeSingle();

      if (contentData) {
        setContent(contentData.value);
      } else {
        // Fallback content if not set in database
        setContent(`
# Privaatsuspoliitika

Oleme võtnud endale kohustuse kaitsta klientide ja kasutajate privaatsust. Sellest lähtuvalt oleme koostanud käesolevad privaatsuspoliitika põhimõtted, mis käsitlevad kliendi andmete kogumist, kasutamist, avaldamist, edastamist ja talletamist. Meie tegevus internetis on kooskõlas kõigi asjakohaste tegevuste ja vastavate Euroopa Liidu õigusaktide ja Eesti Vabariigi seadustega.

## ISIKUANDMETE KOGUMINE JA KASUTAMINE

Isikuandmed on andmed, mida Leatex OÜ kogub üksikisiku tuvastamiseks või temaga ühenduse võtmiseks. Isikuandmete kogumine võib toimuda kliendi nõusolekul järgnevatel viisidel:

- Kontaktandmete (sh teie nimi, postiaadress, telefoninumber, e-posti aadress) esitamisel meie veebilehel
- Veebilehe kasutamisel kliendi kontoinfost või küpsiste (cookies) kaudu ostu või tellimuse pärimise sooritamisel meie e-poes
- Pakkumise taotluse esitamisel

Kogutud isikuandmete abil saame teavitada kliente Leatex OÜ uudistest, kampaaniatest ja tulevastest sündmustest.

## ISIKUANDMETE KAITSE

Leatex OÜ rakendab kõiki ettevaatusabinõusid (sh administratiivsed, tehnilised ja füüsilised meetmed) kliendi isikuandmete kaitsmiseks.

## KONTAKTANDMED

**Ettevõte:** Leatex OÜ  
**E-post:** pavel@leatex.ee

Kõigi privaatsuspoliitika või andmetöötluse kohta tekkivate küsimuste või muredega palume võtta meiega ühendust.
        `);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      // Use fallback content on error
      setContent("Privaatsuspoliitika sisu laadimise viga. Palun proovige hiljem uuesti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-primary mb-6">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-primary mb-4 mt-8">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-primary mb-3 mt-6">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="mb-2">{line.substring(2)}</li>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-2">{line.substring(2, line.length - 2)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-lg">Laaditakse...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-primary mb-8 text-center">
                {title}
              </h1>
              
              <div className="prose max-w-none space-y-6 text-muted-foreground">
                {renderMarkdown(content)}
                
                <div className="text-center text-sm text-muted-foreground mt-8 pt-6 border-t">
                  Viimati uuendatud: {new Date().toLocaleDateString('et-EE')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privaatsus;