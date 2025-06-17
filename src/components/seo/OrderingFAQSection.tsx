
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const OrderingFAQSection = () => {
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

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6">Tellimisprotsessi KKK</h3>
      <Accordion type="single" collapsible className="w-full">
        {orderingFAQs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default OrderingFAQSection;
