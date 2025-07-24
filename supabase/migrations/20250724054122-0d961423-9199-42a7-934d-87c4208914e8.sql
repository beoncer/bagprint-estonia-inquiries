-- Clear existing test data and populate with proper customer guarantees
DELETE FROM guarantees;

-- Insert the 6 customer guarantees based on the reference screenshot
INSERT INTO guarantees (title, description, "order") VALUES
(
  'Garanteerime parima hinna',
  'Pakume pühendumusega määratletud klientidele parima ostukogemuse ja hinna pakkumisele. Kui teil õnnestub kuskit madalam hind leida, ärge muretsege. Teeme kõik endast oleneva, et teha teile veelgi parem pakkumine.',
  1
),
(
  'Garanteerime personaalse teeninduse',
  'Pakume personaalset teenindust, et aidata teil iga klienti küsimuste või muredega, mis neil võivad esineda. Oleme uhked, et pakume tähelepanelikku tuge, et tagada kõigile sujuv kogemus.',
  2
),
(
  'Garanteerime hea kvaliteedi',
  'Oleme pühendunud oma hinnatutud klientidele pakkuma kõrgeima kvaliteediga tooteid ning sinna hulka kuuluvad ka meie ökoloogilisest puuvillast kottide valik. Meie pühendumus jätkusuutlikkusele ja keskkonnasõbralikkusele tagab, et iga kott on valmistatud parimatest materjalidest, pakkudes nii vastupidavust, kui ka keskkonnateadlikkust.',
  3
),
(
  'Garanteerime näidised',
  'Enne iga tellimust tagame klientide rahulolu, pakkudes oma kottide füüsilisi või digitaalseid näidiseid. Kogege esmalt kvaliteeti ja disaini, tagades kindlustunde meilt ostes.',
  4
),
(
  'Garanteerime rahulolu',
  'Meie ettevõttes on kliendi rahulolu esmane prioriteet. Seisame oma toodete ja teenuste taga, pakkudes garantiid, mis tagab, et saate parima võimaliku kogemuse.',
  5
),
(
  'Garanteerime õigeaegse kohaletoimetamise',
  'Oleme uhked teie tellimuste kiire kohaletoimetamise üle, tagades, et saate oma ökoloogilisest puuvillast kotid probleemideta kätte just siis, kui neid vajate.',
  6
);