
import { useEffect } from 'react';

const OrderingFAQStructuredData = () => {
  useEffect(() => {
    // Remove any existing ordering FAQ structured data
    const existingScript = document.querySelector('script[data-ordering-faq-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    const orderingFAQs = [
      {
        question: "Kuidas ma saan tellimuse esitada?",
        answer: "Tellimuse esitamiseks klikkige nupul 'Küsi pakkumist' ja täitke vorm oma kontaktandmete ja soovitava kogusega. Meie meeskond võtab teiega 24 tunni jooksul ühendust."
      },
      {
        question: "Kui kiiresti ma saan hinnapakkumise?",
        answer: "Saadame teile hinnapakkumise tavaliselt 24 tunni jooksul pärast päringu saamist. Keerulisemate tellimuste puhul võib see võtta kuni 48 tundi."
      },
      {
        question: "Kas on olemas miinimumtellimusekogus?",
        answer: "Jah, meie miinimumtellimusekogus on tavaliselt 50 tk. Väiksemate koguste kohta palun võtke meiega otse ühendust."
      },
      {
        question: "Millised on maksevõimalused?",
        answer: "Pakume mitmeid maksevõimalusi: pangaülekanne, arve järgi maksmine ettevõtetele ja sularahamakse kaupade kättetoimetamisel."
      },
      {
        question: "Kui kaua võtab tellimuse täitmine?",
        answer: "Standardsed tellimused täidame tavaliselt 5-10 tööpäeva jooksul. Kohandatud trükiga tooted võivad võtta 10-15 tööpäeva, sõltuvalt keerukusest ja kogusest."
      },
      {
        question: "Kas pakute kohaletoimetamist?",
        answer: "Jah, pakume kohaletoimetamist üle Eesti. Tallinna ja Tartu piires on kohaletoimetamine tasuta tellimustele alates 100€. Teistesse piirkondadesse kehtivad soodsamad tarnehinnad."
      }
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": orderingFAQs.map(faq => ({
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

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[data-ordering-faq-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default OrderingFAQStructuredData;
