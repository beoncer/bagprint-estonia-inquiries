
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import InquiryForm from "@/components/ui/InquiryForm";

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  
  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Küsi pakkumist</h1>
            <p className="text-gray-600 mb-10">
              Täida allolevad väljad ja saadame sulle personaalse pakkumise. 
              Vastame pakkumise päringutele tavaliselt ühe tööpäeva jooksul.
            </p>
            
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
        </div>
      </div>
    </Layout>
  );
};

export default Inquiry;
