import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FAQ {
  question: string;
  answer: string;
}

const OrderingFAQStructuredData = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      const { data } = await supabase
        .from('website_content')
        .select('key, value')
        .eq('page', 'product_faq');
      if (data) {
        const faqArr: FAQ[] = [];
        data.forEach((row: any) => {
          const match = row.key.match(/^ordering_faq_(\d+)_(question|answer)$/);
          if (match) {
            const idx = parseInt(match[1]);
            const type = match[2];
            if (!faqArr[idx]) faqArr[idx] = { question: '', answer: '' };
            faqArr[idx][type] = row.value;
          }
        });
        setFaqs(faqArr.filter(faq => faq && (faq.question || faq.answer)));
      }
    };
    fetchFAQs();
  }, []);

  useEffect(() => {
    // Remove any existing ordering FAQ structured data
    const existingScript = document.querySelector('script[data-ordering-faq-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }
    if (faqs && faqs.length > 0) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-ordering-faq-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[data-ordering-faq-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqs]);

  return null; // This component doesn't render anything visible
};

export default OrderingFAQStructuredData;
