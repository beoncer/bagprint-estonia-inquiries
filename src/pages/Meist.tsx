import React from "react";

const guarantees = [
  {
    title: "Parima hinna garantii",
    desc: "Pakume alati parimat hinda. Kui leiad mujalt odavama pakkumise, teeme sulle veelgi parema!",
  },
  {
    title: "Personaalne teenindus",
    desc: "Iga klient on meile oluline. Vastame kiiresti ja aitame igas küsimuses.",
  },
  {
    title: "Hea kvaliteet",
    desc: "Meie kotid on valmistatud parimatest materjalidest, tagades vastupidavuse ja keskkonnasõbralikkuse.",
  },
  {
    title: "Näidised",
    desc: "Soovi korral saadame enne tellimust näidised, et saaksid veenduda kvaliteedis.",
  },
  {
    title: "Rahulolu garantii",
    desc: "Seisame oma toodete ja teenuste eest. Kui sa pole rahul, leiame lahenduse!",
  },
  {
    title: "Õigeaegne kohaletoimetamine",
    desc: "Tagame kiire ja täpse tarne – saad oma kotid alati õigel ajal kätte.",
  },
];

const stats = [
  { label: "Aastat turul", value: "7+" },
  { label: "Riiki", value: "4" },
  { label: "Rahulolevat klienti", value: "2000+" },
];

const Meist: React.FC = () => {
  return (
    <div className="bg-[#faf7f7] min-h-screen pb-16">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">Loome piste haaval rohelisema homse</h1>
          <p className="text-lg text-gray-700 mb-6">
            Meie lugu algab armastusest keskkonna vastu ja tõsisest lubadusest võidelda plastireostusega. Pakume jätkusuutlikke alternatiive: puuvillast, taaskasutatud materjalidest ja paberist kotid. Iga valik loeb – teeme seda koos!
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{stat.value}</div>
            <div className="text-gray-700 text-sm uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Company Story */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Meie missioon</h2>
          <p className="text-gray-700 mb-4">
            Oleme pühendunud sellele, et pakkuda plastkottidele keskkonnasõbralikke alternatiive. Usume, et iga väike samm aitab luua tervema planeedi järgmistele põlvkondadele. Meie valikus on ainult hoolikalt valitud materjalidest kotid, mis on vastupidavad ja stiilsed.
          </p>
          <p className="text-gray-700">
            Meie meeskond hoolitseb selle eest, et iga klient saaks personaalset teenindust ja parima võimaliku kogemuse. Oleme uhked oma kiire tarne, paindlike lahenduste ja ausa suhtluse üle.
          </p>
        </div>
      </section>

      {/* Guarantees */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Meie lubadused</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guarantees.map((g) => (
            <div key={g.title} className="bg-white rounded-lg shadow p-6">
              <div className="text-lg font-semibold text-red-600 mb-2">{g.title}</div>
              <div className="text-gray-700 text-sm">{g.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Meist; 