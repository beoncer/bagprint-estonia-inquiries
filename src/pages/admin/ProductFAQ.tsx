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

const PRODUCT_FAQ_KEY_PREFIX = "ordering_faq";

const ProductFAQAdmin: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "product_faq");
      if (data) {
        const faqArr: FAQ[] = [];
        data.forEach((row: any) => {
          const match = row.key.match(/^ordering_faq_(\d+)_(question|answer)$/);
          if (match) {
            const idx = parseInt(match[1]);
            const type = match[2];
            if (!faqArr[idx]) faqArr[idx] = { question: "", answer: "" };
            faqArr[idx][type] = row.value;
          }
        });
        setFaqs(faqArr.filter(faq => faq && (faq.question || faq.answer)));
      }
      setLoading(false);
    };
    fetchFAQs();
  }, []);

  const handleFAQChange = (faqIndex: number, field: keyof FAQ, value: string) => {
    setFaqs(prev => prev.map((faq, idx) =>
      idx === faqIndex ? { ...faq, [field]: value } : faq
    ));
  };

  const handleAddFAQ = () => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  };

  const handleRemoveFAQ = (faqIndex: number) => {
    setFaqs(prev => prev.filter((_, idx) => idx !== faqIndex));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    // Remove all previous ordering_faq keys for this page
    // (optional: could optimize to only update changed ones)
    // Upsert new ones
    const updates = faqs.flatMap((faq, index) => [
      { page: "product_faq", key: `${PRODUCT_FAQ_KEY_PREFIX}_${index}_question`, value: faq.question },
      { page: "product_faq", key: `${PRODUCT_FAQ_KEY_PREFIX}_${index}_answer`, value: faq.answer }
    ]);
    // Remove empty faqs
    const filteredUpdates = updates.filter(u => u.value.trim() !== "");
    // Upsert
    const { error } = await supabase.from("website_content").upsert(filteredUpdates, { onConflict: "page,key" });
    setSaving(false);
    if (!error) {
      setSuccess(true);
      toast({ title: "Success", description: "Product FAQ updated successfully" });
    } else {
      toast({ title: "Error", description: `Failed to save FAQ: ${error.message}`, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product FAQ (Tellimisprotsessi KKK)</h2>
      <form onSubmit={handleSave}>
        <div className="space-y-4">
          {faqs.map((faq, faqIndex) => (
            <div key={faqIndex} className="border rounded p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">KKK #{faqIndex + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveFAQ(faqIndex)}
                  disabled={loading || saving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="block text-sm font-medium mb-1">Küsimus</Label>
                  <Input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={faq.question}
                    onChange={e => handleFAQChange(faqIndex, "question", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Vastus</Label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    value={faq.answer}
                    onChange={e => handleFAQChange(faqIndex, "answer", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" className="mt-6" onClick={handleAddFAQ} disabled={loading || saving}>
          Lisa uus KKK
        </Button>
        <Button type="submit" className="mt-6 ml-4" disabled={loading || saving}>
          {saving ? "Salvestan..." : "Salvesta kõik"}
        </Button>
        {success && <div className="text-green-600 mt-2">Salvestatud!</div>}
      </form>
    </div>
  );
};

export default ProductFAQAdmin; 