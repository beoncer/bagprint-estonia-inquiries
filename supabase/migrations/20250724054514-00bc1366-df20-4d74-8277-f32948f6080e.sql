-- Clear existing guarantees and add original Estonian content
DELETE FROM guarantees;

-- Insert 6 original Estonian guarantees based on reference themes
INSERT INTO guarantees (title, description, "order") VALUES
(
  'Parim hind turul',
  'Meie eesmärk on pakkuda klientidele kõige konkurentsivõimelist hinda turul. Juhul kui leiate mujalt soodsamat pakkumist, võtke meiega ühendust ja püüame teha veelgi paremat hinnapakkumist.',
  1
),
(
  'Individuaalne lähenemine',
  'Iga klient on meile oluline ja pakume personaalset nõustamist kõigis küsimustes. Meie meeskond on alati valmis aitama ja leidma parima lahenduse teie vajadustele.',
  2
),
(
  'Kõrgeim kvaliteet',
  'Kasutame ainult kvaliteetseid materjale ja järgime rangeid tootmisstandardeid. Meie ökoloogilised puuvillakotid on vastupidavad, turvalised ja keskkonnasõbralikud.',
  3
),
(
  'Proovimise võimalus',
  'Enne suure tellimuse esitamist pakume võimalust tellida näidiseid, et saaksite veenduda meie toodete kvaliteedis ja sobivuses oma vajadustele.',
  4
),
(
  'Tagatud rahulolu',
  'Kliendi rahulolu on meie prioriteet number üks. Tagame, et iga tellimus vastab teie ootustele ja vajaduste korral otsime koos parima lahenduse.',
  5
),
(
  'Kiire tarnimine',
  'Tagame tellimuste kiire ja usaldusväärse kohaletoimetamise kokkulepitud ajaks. Meie logistikapartnerid kindlustavad, et teie tellimus jõuab õigeks ajaks kohale.',
  6
);