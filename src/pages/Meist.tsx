
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Users, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const Meist = () => {
  const values = [
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Kvaliteet",
      description: "Kasutame ainult kõrgekvaliteetseid materjale ja tänapäevaseid trükitehnoloogiaid, et tagada parim tulemus."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Kliendikeskne",
      description: "Meie eesmärk on pakkuda personaalset teenindust ja leida igale kliendile parim lahendus."
    },
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: "Kogemus",
      description: "Üle 10 aasta kogemus pakendite ja kottide valmistamises ning trükkimises."
    },
    {
      icon: <Truck className="h-12 w-12 text-primary" />,
      title: "Kiire tarnimine",
      description: "Efektiivne tootmisprotsess võimaldab meil pakkuda kiireid tarnimisaegu kogu Eestis."
    }
  ];

  const team = [
    {
      name: "Mari Tamm",
      position: "Müügijuht",
      image: "/placeholder.svg",
      description: "Mari aitab klientidel leida parimad lahendused nende vajadustele."
    },
    {
      name: "Jaan Kask",
      position: "Tootmisjuht", 
      image: "/placeholder.svg",
      description: "Jaan tagab, et kõik tooted valmivad kõrgeima kvaliteediga."
    },
    {
      name: "Liisa Mets",
      position: "Disainer",
      image: "/placeholder.svg",
      description: "Liisa aitab luua silmapaistvaid disaine, mis rõhutavad teie brändi."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-primary">Meist</span>{" "}
              <span className="text-black">Leatex</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl">
              Oleme Eesti juhtiv kottide ja pakendite tootja, kes spetsialiseeerub 
              kvaliteetsetele puuvillakottidele, paberkottidele ja kohandatud trükile. 
              Meie eesmärk on aidata ettevõtetel luua unustamatu brändikogemust.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Meie lugu</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Leatex asutati 2010. aastal eesmärgiga pakkuda Eesti ettevõtetele 
                  kvaliteetseid ja keskkonnasõbralikke pakendilahendusi. Alustasime 
                  väikese perefirmana, kuid täna teenindame sadu rahulolus kliente 
                  üle kogu Eesti.
                </p>
                <p>
                  Meie võtmeks on olnud järjepideva kvaliteedi säilitamine ja 
                  klientide vajaduste kuulamine. Investeerime pidevalt uutesse 
                  tehnoloogiatesse ja materjalidemasse, et pakkuda parimaid 
                  lahendusi.
                </p>
                <p>
                  Täna oleme uhked oma saavutuste üle ja jätkame kasvamist, 
                  säilitades samal ajal personaalse lähenemise igale kliendile.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="/placeholder.svg" 
                alt="Leatex tehas" 
                className="rounded-lg shadow-sm w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meie väärtused</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meie meeskond</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.position}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-gray-600">Aastat kogemust</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Rahulolev klient</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50k+</div>
              <p className="text-gray-600">Toodetud kotti</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24h</div>
              <p className="text-gray-600">Keskmine tarnimisaeg</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Valmis alustama koostööd?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Võtke meiega ühendust ja räägime, kuidas saame aidata teie ettevõtet 
            paremini esile tuua kvaliteetsete kottide ja pakendite abil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/paring">Küsi pakkumist</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/kontakt">Võta ühendust</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Meist;
