import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Ostutingimused: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-primary mb-8 text-center">
                Tellimise ja Müügitingimused
              </h1>
              
              <div className="prose max-w-none space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Need müügitingimused kehtivad kõikidele tellimustele ja müügitehingutele, 
                  mis sõlmitakse Leatex OÜ-ga. Tellimuse esitamisega kinnitab klient, 
                  et on tutvunud tingimustega ja nõustub nendega.
                </p>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    1. ÜLDINFO
                  </h2>
                  <p>
                    <strong>Müüja:</strong> Leatex OÜ<br/>
                    <strong>Kontakt:</strong> pavel@leatex.ee<br/>
                    <strong>Tegevusala:</strong> Kotid ja pakendite valmistamine koos trükiteenusega
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    2. PAKKUMISED JA HINNAD
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Kõik hinnapakkumised on individuaalsed ja sõltuvad tellitavast kogusest</li>
                    <li>Esitatud hinnad on käibemaksuta, välja arvatud juhul, kui on märgitud teisiti</li>
                    <li>Lõplik hind kinnitatakse pärast tehnilise joonise ja materjalivaliku heakskiitmist</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    3. TELLIMUSE VORMISTAMINE
                  </h2>
                  <p className="mb-4">
                    Tellimus loetakse kinnitatuks, kui:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Klient on heaks kiitnud tehnilise joonise ja disaini</li>
                    <li>Lõplik hind on kirjalikult kinnitatud</li>
                    <li>Ettemakse on laekunud meie arveldusarvele</li>
                    <li>Tarnekuupäev on kokku lepitud</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    4. MAKSEKORRALDUS
                  </h2>
                  <div className="bg-muted p-6 rounded-lg mb-4">
                    <p className="mb-2"><strong>Standard tingimused:</strong></p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Ettemakse: 100% tellimuse kinnitamisel. Vana kliendidele 0% ettemakse</li>
                      <li>Lõppmakse: enne kauba väljastamist või tarnet</li>
                      <li>Makseperiood: 7 kalendripäeva arve koostamisest</li>
                    </ul>
                  </div>
                  <p>
                    Suuremahuliste projektide puhul või pikaajaliste klientide jaoks võime 
                    pakkuda individuaalseid maksetingimusi.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    5. TOOTMISAEG JA TARNEINFO
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tootmisaeg avatakse pärast ettemakse laekumist ja kõigi detailide kinnitamist</li>
                    <li>Standardne tootmisaeg on 2-4 nädalat, sõltuvalt kogusest ja keerukusest</li>
                    <li>Kiirendatud tootmine on võimalik kokkuleppel, eest võib rakenduda lisatasu</li>
                    <li>Täpsed tarneajad lepitakse kokku tellimuse kinnitamisel</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    6. TRANSPORT JA TARNEKULUD
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Tasuta tarne:</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm">
                        <li>Tellimused alates 150€ Eesti piires</li>
                        <li>Ühele tarneaadressile</li>
                        <li>Töötama tööpäevadel</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Lisatasud:</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm">
                        <li>Kiirendatud tarne</li>
                        <li>Mitme tarneaadressi korral</li>
                        <li>Rahvusvahelised saadetised</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    7. KVALITEEDIKONTROLL JA VASTUTUS
                  </h2>
                  <p className="mb-4">
                    Leatex OÜ vastutab tarnitud toodete kvaliteedi eest ja tagab, et:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tooted vastavad kinnitatud spetsifikatsioonidele</li>
                    <li>Trükikvaliteet vastab tööstuse standarditele</li>
                    <li>Materjalid on uued ja defektivabad</li>
                    <li>Pakendamine tagab kauba turvalisuse transpordil</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    8. REKLAMATSIOONID JA PUUDUSED
                  </h2>
                  <div className="bg-orange-50 border-l-4 border-orange-200 p-4 mb-4">
                    <p className="font-semibold text-orange-800 mb-2">OLULINE:</p>
                    <p className="text-orange-700 text-sm">
                      Kauba vastuvõtmisel tuleb koheselt kontrollida tarnitud kogust ja kvaliteeti. 
                      Reklamatsioonid tuleb esitada 48 tunni jooksul kauba kättesaamisest.
                    </p>
                  </div>
                  <p>
                    Õigustatud reklamatsiooni korral kohustume:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Asendama defektsed tooted uutega</li>
                    <li>Hüvitama tekkinud kahjud kokkuleppel</li>
                    <li>Võtma enda kanda transportkulud</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    9. KLIENDI KOHUSTUSED
                  </h2>
                  <p className="mb-4">Klient kohustub:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Esitama õiged ja täpsed disainifailid sobivas vormingus (vähemalt 300 DPI)</li>
                    <li>Kinnitama kõik detailid enne tootmise alustamist</li>
                    <li>Tasuma arved kokkulepitud tähtajaks</li>
                    <li>Vastuvõtma tellitud kauba tarnelepingu kohaselt</li>
                    <li>Kontrollima kauba vastavust ja kvaliteeti kättesaamise hetkel</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    10. MUUDATUSED JA TÜHISTAMISED
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">Enne tootmist:</h4>
                      <p className="text-sm">
                        Tellimust saab muuta või tühistada tasuta kuni tootmise alguseni. 
                        Juba tehtud disainitöö eest võidakse küsida hüvitist.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">Pärast tootmise algust:</h4>
                      <p className="text-sm">
                        Tellimuse tühistamine või oluline muutmine ei ole võimalik. 
                        Klient on kohustatud tellitud kauba vastu võtma.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    11. VAIDLUSTE LAHENDAMINE
                  </h2>
                  <p>
                    Kõik vaidlused püütakse lahendada läbirääkimiste teel. Kui kokkulepe 
                    ei ole võimalik, lahendatakse vaidlused Eesti Vabariigi seadusandluse 
                    alusel Harju Maakohtus.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    12. LÕPPSÄTTED
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Need tingimused kehtivad kuni nende muutmiseni</li>
                    <li>Muudatustest teavitame klientide 14 päeva ette</li>
                    <li>Kui mõni tingimus osutub kehtetuks, jäävad ülejäänud tingimused kehtima</li>
                    <li>Tingimused on koostatud vastavalt Eesti Vabariigi seadusandlusele</li>
                  </ul>
                </section>

                <div className="bg-primary/5 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold text-primary mb-3">Kontakt küsimuste korral</h3>
                  <p><strong>Leatex OÜ</strong></p>
                  <p>E-post: <a href="mailto:pavel@leatex.ee" className="text-primary hover:underline">pavel@leatex.ee</a></p>
                  <p className="mt-2 text-sm">
                    Oleme alati valmis selgitama tingimusi ja leidma parimaid lahendusi 
                    teie projektide jaoks.
                  </p>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-8 pt-6 border-t">
                  Tingimused kehtivad alates: {new Date().toLocaleDateString('et-EE')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ostutingimused;