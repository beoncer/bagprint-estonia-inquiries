import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileText } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface PageContent {
  id?: string;
  page: string;
  title: string;
  content: string;
  meta_description?: string;
}

const PagesContentAdmin: React.FC = () => {
  const [privacyContent, setPrivacyContent] = useState<PageContent>({
    page: "privaatsus",
    title: "Privaatsuspoliitika",
    content: "",
    meta_description: ""
  });
  
  const [termsContent, setTermsContent] = useState<PageContent>({
    page: "ostutingimused", 
    title: "Tellimise ja Müügitingimused",
    content: "",
    meta_description: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      
      // Fetch privacy policy content
      const { data: privacyData, error: privacyError } = await supabase
        .from("website_content")
        .select("*")
        .eq("page", "privaatsus")
        .eq("key", "page_content")
        .single();

      if (!privacyError && privacyData) {
        setPrivacyContent(prev => ({
          ...prev,
          id: privacyData.id,
          content: privacyData.value || ""
        }));
      }

      // Fetch terms content
      const { data: termsData, error: termsError } = await supabase
        .from("website_content")
        .select("*")
        .eq("page", "ostutingimused")
        .eq("key", "page_content")
        .single();

      if (!termsError && termsData) {
        setTermsContent(prev => ({
          ...prev,
          id: termsData.id,
          content: termsData.value || ""
        }));
      }

      // Fetch page titles
      const { data: privacyTitle } = await supabase
        .from("website_content")
        .select("*")
        .eq("page", "privaatsus")
        .eq("key", "page_title")
        .single();

      if (privacyTitle) {
        setPrivacyContent(prev => ({
          ...prev,
          title: privacyTitle.value || "Privaatsuspoliitika"
        }));
      }

      const { data: termsTitle } = await supabase
        .from("website_content")
        .select("*")
        .eq("page", "ostutingimused")
        .eq("key", "page_title")
        .single();

      if (termsTitle) {
        setTermsContent(prev => ({
          ...prev,
          title: termsTitle.value || "Tellimise ja Müügitingimused"
        }));
      }

    } catch (error: any) {
      toast({
        title: "Viga sisu laadimisel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePageContent = async (pageData: PageContent) => {
    try {
      setSaving(true);

      // Save page content
      const contentData = {
        page: pageData.page,
        key: "page_content",
        value: pageData.content,
      };

      if (pageData.id) {
        await supabase
          .from("website_content")
          .update(contentData)
          .eq("id", pageData.id);
      } else {
        const { data, error } = await supabase
          .from("website_content")
          .insert(contentData)
          .select()
          .single();
        
        if (error) throw error;
        
        if (pageData.page === "privaatsus") {
          setPrivacyContent(prev => ({ ...prev, id: data.id }));
        } else {
          setTermsContent(prev => ({ ...prev, id: data.id }));
        }
      }

      // Save page title
      const titleData = {
        page: pageData.page,
        key: "page_title",
        value: pageData.title,
      };

      await supabase
        .from("website_content")
        .upsert(titleData, { 
          onConflict: "page,key" 
        });

      toast({
        title: "Sisu salvestatud",
        description: `${pageData.title} on edukalt salvestatud`,
      });

    } catch (error: any) {
      toast({
        title: "Viga salvestamisel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Laadin sisu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Lehekülgede sisu haldamine</h1>
      </div>

      <Tabs defaultValue="privaatsus" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="privaatsus">Privaatsuspoliitika</TabsTrigger>
          <TabsTrigger value="ostutingimused">Ostutingimused</TabsTrigger>
        </TabsList>

        <TabsContent value="privaatsus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privaatsuspoliitika (/privaatsus)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Lehe pealkiri
                </label>
                <Input
                  value={privacyContent.title}
                  onChange={(e) => setPrivacyContent(prev => ({ 
                    ...prev, 
                    title: e.target.value 
                  }))}
                  placeholder="Privaatsuspoliitika"
                />
              </div>

              <div>
                <RichTextEditor
                  label="Lehe sisu"
                  value={privacyContent.content}
                  onChange={(value) => setPrivacyContent(prev => ({ 
                    ...prev, 
                    content: value 
                  }))}
                  placeholder="Kirjutage siia privaatsuspoliitika sisu..."
                  rows={20}
                />
              </div>

              <Button 
                onClick={() => savePageContent(privacyContent)}
                disabled={saving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvestamine..." : "Salvesta privaatsuspoliitika"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ostutingimused" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ostutingimused (/ostutingimused)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Lehe pealkiri
                </label>
                <Input
                  value={termsContent.title}
                  onChange={(e) => setTermsContent(prev => ({ 
                    ...prev, 
                    title: e.target.value 
                  }))}
                  placeholder="Tellimise ja Müügitingimused"
                />
              </div>

              <div>
                <RichTextEditor
                  label="Lehe sisu"
                  value={termsContent.content}
                  onChange={(value) => setTermsContent(prev => ({ 
                    ...prev, 
                    content: value 
                  }))}
                  placeholder="Kirjutage siia ostutingimuste sisu..."
                  rows={20}
                />
              </div>

              <Button 
                onClick={() => savePageContent(termsContent)}
                disabled={saving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvestamine..." : "Salvesta ostutingimused"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Märkus:</h3>
        <p className="text-sm text-muted-foreground">
          Siin saate muuta lehekülgede sisu. Muudatused jõustuvad kohe pärast salvestamist. 
          Saate kasutada Markdown vormindust teksti struktureerimiseks.
        </p>
      </div>
    </div>
  );
};

export default PagesContentAdmin;