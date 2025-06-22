
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

const OrderingFAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tellimisprotsessi KKK
      </h3>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-16 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : faqs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
              <AccordionTrigger className="text-left text-gray-900 hover:text-gray-700">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-gray-500">Tellimisprotsessi KKK pole veel lisatud.</p>
      )}
    </div>
  );
};

export default OrderingFAQSection;
