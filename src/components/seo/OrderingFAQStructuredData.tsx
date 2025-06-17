
import { useEffect } from 'react';

const orderingFAQs = [
  {
    question: "Kuidas tellimust esitada?",
    answer: "Tellimuse esitamiseks täitke meie veebilehel olev päringuvorm või võtke otse ühendust meie müügimeeskonnaga. Märkige kindlasti soovitud toote tüüp, kogus ja trükivajadused."
  },
  {
    question: "Milline on minimaalne tellimuskogus?",
    answer: "Minimaalne tellimiskogus sõltub toote tüübist ja trükimeetodist. Tavaliselt alates 50 tükist, kuid väiksemate koguste puhul võtke meiega ühendust - leiame kindlasti lahenduse."
  },
  {
    question: "Kui kaua võtab tellimuse täitmine?",
    answer: "Tavaline tarneaeg on 7-14 tööpäeva, sõltuvalt kogusest ja trüki keerukusest. Kiireloomuliste tellimuste puhul võime pakkuda kiiremat täitmist lisatasu eest."
  },
  {
    question: "Kas saate pakkuda disainiabi?",
    answer: "Jah, meie disainerid aitavad teil luua sobiva disaini või kohandada olemasolevat logo koti jaoks. Disainiteenus on kaasatud suurema koguse tellimuste puhul."
  },
  {
    question: "Millised on maksevõimalused?",
    answer: "Pakume paindlikke maksevõimalusi: pangaülekanne, arve järgi maksmine või järelmaks. Ettevõtetele saame koostada maksegraafiku vastavalt vajadusele."
  },
  {
    question: "Kas saate saata näidiseid?",
    answer: "Jah, saame saata tootejäidiseid enne tellimuse lõplikku kinnitamist. Näidiste saatmine on tasuta suurema koguse tellimuste puhul."
  }
];

interface OrderingFAQStructuredDataProps {
  category: string;
}

const OrderingFAQStructuredData = ({ category }: OrderingFAQStructuredDataProps) => {
  useEffect(() => {
    // Remove any existing ordering FAQ structured data
    const existingScript = document.querySelector('script[data-ordering-faq-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

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
  }, [category]);

  return null; // This component doesn't render anything visible
};

export default OrderingFAQStructuredData;
