import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Privaatsus: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-primary mb-8 text-center">
                Privaatsuspoliitika
              </h1>
              
              <div className="prose max-w-none space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Oleme võtnud endale kohustuse kaitsta klientide ja kasutajate privaatsust. 
                  Sellest lähtuvalt oleme koostanud käesolevad privaatsuspoliitika põhimõtted, 
                  mis käsitlevad kliendi andmete kogumist, kasutamist, avaldamist, edastamist ja talletamist. 
                  Meie tegevus internetis on kooskõlas kõigi asjakohaste tegevuste ja vastavate 
                  Euroopa Liidu õigusaktide ja Eesti Vabariigi seadustega.
                </p>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    ISIKUANDMETE KOGUMINE JA KASUTAMINE
                  </h2>
                  <p className="mb-4">
                    Isikuandmed on andmed, mida Leatex OÜ kogub üksikisiku tuvastamiseks või 
                    temaga ühenduse võtmiseks. Isikuandmete kogumine võib toimuda kliendi nõusolekul 
                    järgnevatel viisidel:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Kontaktandmete (sh teie nimi, postiaadress, telefoninumber, e-posti aadress) 
                      esitamisel meie veebilehel
                    </li>
                    <li>
                      Veebilehe kasutamisel kliendi kontoinfost või küpsiste (cookies) kaudu ostu 
                      või tellimuse pärimise sooritamisel meie e-poes
                    </li>
                    <li>
                      Pakkumise taotluse esitamisel
                    </li>
                  </ul>
                  <p className="mt-4">
                    Kogutud isikuandmete abil saame teavitada kliente Leatex OÜ uudistest, 
                    kampaaniatest ja tulevastest sündmustest. Klient, kes ei soovi olla meie 
                    uudiskirjaloendis, saab ennast sellest igal ajal eemaldada. Kogutud isikuandmeid 
                    kasutame ka kauba kohaletoimetamiseks ning kliendi ees võetud kohustuste täitmiseks.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    ISIKUANDMETE KAITSE
                  </h2>
                  <p>
                    Leatex OÜ rakendab kõiki ettevaatusabinõusid (sh administratiivsed, tehnilised ja 
                    füüsilised meetmed) kliendi isikuandmete kaitsmiseks. Juurdepääs andmete muutmiseks 
                    ja töötlemiseks on ainult selleks volitatud isikutel.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    TURVALISUS
                  </h2>
                  <p>
                    Kõik Leatex OÜ veebilehe külastamise ja pakkumiste pärimise käigus teatavaks 
                    saanud kliendi isikuandmeid käsitletakse kui konfidentsiaalset infot. 
                    Krüpteeritud andmesidekanal tagab kommunikatsiooni turvalisuse.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    ANDMETE JAGAMINE KOLMANDATE OSAPOOLTEGA
                  </h2>
                  <p>
                    Kliendi paremaks teenindamiseks võib Leatex OÜ avaldada teavet üksikute 
                    kasutajate kohta kolmandale osapoolele, kes osutab Leatex OÜ teenuseid ning 
                    on lepinguga kohustunud hoidma jagatud teavet konfidentsiaalsena. Kolmandaks 
                    osapooleks on näiteks meie partner, kelle ülesanneteks on müüdavate kaupade transport.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    ANDMETE SÄILITAMINE
                  </h2>
                  <p>
                    Säilitame teie isikuandmeid nii kaua, kui see on vajalik käesoleva 
                    privaatsuspoliitikaga või seadusega ette nähtud eesmärkide täitmiseks. 
                    Kui teil ei ole enam meie teenustega seotud suhteid, kustutame või 
                    anonümiseerime teie isikuandmed.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    TEIE ÕIGUSED
                  </h2>
                  <p className="mb-4">
                    Vastavalt Euroopa Liidu Üldisele Andmekaitse Määrusele (GDPR) on teil õigus:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Juurdepääsuks oma isikuandmetele</li>
                    <li>Oma andmete parandamisele</li>
                    <li>Oma andmete kustutamisele</li>
                    <li>Andmetöötluse piiramisele</li>
                    <li>Andmete ülekandmisele</li>
                    <li>Vastuväitele andmetöötlusele</li>
                  </ul>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    PRIVAATSUSPOLIITIKA TINGIMUSED JA MUUDATUSED
                  </h2>
                  <p>
                    Jätame endale õiguse vajadusel privaatsustingimusi muuta. Meie veebilehte 
                    kasutama asudes, eeldame, et olete nende põhimõtetega tutvunud ning nõustute 
                    nendega. Muudatustest teavitame teid meie veebilehe kaudu.
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    KONTAKTANDMED
                  </h2>
                  <div className="bg-muted p-6 rounded-lg">
                    <p className="mb-2">
                      <strong>Ettevõte:</strong> Leatex OÜ
                    </p>
                    <p className="mb-2">
                      <strong>E-post:</strong> pavel@leatex.ee
                    </p>
                    <p>
                      Kõigi privaatsuspoliitika või andmetöötluse kohta tekkivate küsimuste või 
                      muredega palume võtta meiega ühendust.
                    </p>
                  </div>
                </section>

                <div className="text-center text-sm text-muted-foreground mt-8 pt-6 border-t">
                  Viimati uuendatud: {new Date().toLocaleDateString('et-EE')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privaatsus;