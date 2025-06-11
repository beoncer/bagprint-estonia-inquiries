
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Globe, Heart } from "lucide-react";

const guarantees = [
  {
    title: "Parima hinna garantii",
    desc: "Pakume alati parimat hinda. Kui leiad mujalt odavama pakkumise, teeme sulle veelgi parema!",
    icon: CheckCircle,
  },
  {
    title: "Personaalne teenindus",
    desc: "Iga klient on meile oluline. Vastame kiiresti ja aitame igas küsimuses.",
    icon: Users,
  },
  {
    title: "Hea kvaliteet",
    desc: "Meie kotid on valmistatud parimatest materjalidest, tagades vastupidavuse ja keskkonnasõbralikkuse.",
    icon: Heart,
  },
  {
    title: "Näidised",
    desc: "Soovi korral saadame enne tellimust näidised, et saaksid veenduda kvaliteedis.",
    icon: CheckCircle,
  },
  {
    title: "Rahulolu garantii",
    desc: "Seisame oma toodete ja teenuste eest. Kui sa pole rahul, leiame lahenduse!",
    icon: CheckCircle,
  },
  {
    title: "Õigeaegne kohaletoimetamine",
    desc: "Tagame kiire ja täpse tarne – saad oma kotid alati õigel ajal kätte.",
    icon: Globe,
  },
];

const stats = [
  { label: "Aastat turul", value: "7+" },
  { label: "Riiki", value: "4" },
  { label: "Rahulolevat klienti", value: "2000+" },
];

const Meist: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Loome piste haaval{" "}
            <span className="text-primary">rohelisema homse</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Meie lugu algab armastusest keskkonna vastu ja tõsisest lubadusest võidelda plastireostusega. 
            Pakume jätkusuutlikke alternatiive: puuvillast, taaskasutatud materjalidest ja paberist kotid.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
            Tutvu meie toodetega
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="bg-black text-white rounded-2xl p-8 hover:bg-primary transition-all duration-300 group-hover:scale-105">
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-200 text-lg uppercase tracking-wide font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 border-2 border-black">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-black">Meie missioon</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-800 leading-relaxed">
              <p>
                Oleme pühendunud sellele, et pakkuda plastkottidele keskkonnasõbralikke alternatiive. 
                Usume, et iga väike samm aitab luua tervema planeedi järgmistele põlvkondadele. 
                Meie valikus on ainult hoolikalt valitud materjalidest kotid, mis on vastupidavad ja stiilsed.
              </p>
              <p>
                Meie meeskond hoolitseb selle eest, et iga klient saaks personaalset teenindust ja 
                parima võimaliku kogemuse. Oleme uhked oma kiire tarne, paindlike lahenduste ja 
                ausa suhtluse üle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Meie lubadused</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Need on põhimõtted, millele tugineme oma igapäevases töös ja millega tagame parima teenuse
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => {
              const IconComponent = guarantee.icon;
              return (
                <div key={guarantee.title} className="group">
                  <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300 h-full">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-3 group-hover:text-primary transition-colors">
                          {guarantee.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {guarantee.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Valmis alustama koostööd?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Võta meiega ühendust ja arutame, kuidas saame aidata su brändi nähtavamaks muuta 
            kvaliteetsete ja keskkonnasõbralike kottidega.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
              Küsi pakkumist
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg">
              Vaata portfooliod
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Meist;
