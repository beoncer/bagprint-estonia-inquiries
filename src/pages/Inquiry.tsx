
import { useSearchParams } from "react-router-dom";
import InquiryForm from "@/components/ui/InquiryForm";

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section - Matching portfolio page style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Küsi <span className="text-primary">pakkumist</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Täida allolevad väljad ja saadame sulle personaalse pakkumise. 
              Vastame pakkumise päringutele tavaliselt ühe tööpäeva jooksul.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <InquiryForm productId={productId || undefined} />
          
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Kuidas käib pakkumise protsess?</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <span className="font-medium">Pakkumise päring</span> - 
                Täida ülalolev vorm oma andmete ja vajadustega.
              </li>
              <li>
                <span className="font-medium">Kinnitus</span> - 
                Saadame sulle e-kirja, mis kinnitab päringu kättesaamist.
              </li>
              <li>
                <span className="font-medium">Pakkumine</span> - 
                Koostame sulle personaalse pakkumise vastavalt sinu vajadustele.
              </li>
              <li>
                <span className="font-medium">Arutelu</span> - 
                Vajadusel täpsustame detaile ja teeme muudatusi pakkumises.
              </li>
              <li>
                <span className="font-medium">Tellimus</span> - 
                Kui pakkumine sobib, saad kinnitada tellimuse ja alustame tööga.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inquiry;
