
import { useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQ[];
  category: string;
}

const FAQStructuredData = ({ faqs, category }: FAQStructuredDataProps) => {
  useEffect(() => {
    // Remove any existing FAQ structured data
    const existingScript = document.querySelector('script[data-faq-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Only add structured data if we have FAQs
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
      script.setAttribute('data-faq-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[data-faq-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqs, category]);

  return null; // This component doesn't render anything visible
};

export default FAQStructuredData;
