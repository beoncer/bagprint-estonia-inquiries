
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const orderingFAQs = [
  {
    question: "Kuidas tellimust esitada?",
    answer: "Tellimuse esitamiseks täitke meie veebilehel olev päringuvorm või võtke otse ühendust meie müügimeeskonnaga. Märkige kindlasti soovitud toote tüüp, kogus ja trükivajadused."
  },
  {
    question: "Milline on minimaalne tellimiskogus?",
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

interface OrderingFAQSectionProps {
  category?: string;
}

const OrderingFAQSection = ({ category }: OrderingFAQSectionProps) => {
  return (
    <section className="mt-20 mb-16">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Tellimisprotsess</h2>
        <Accordion type="single" collapsible className="w-full">
          {orderingFAQs.map((faq, index) => (
            <AccordionItem key={index} value={`ordering-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default OrderingFAQSection;
