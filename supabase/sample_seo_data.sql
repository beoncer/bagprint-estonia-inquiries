-- Sample SEO data for main pages
-- This can be run in Supabase SQL editor to populate the seo_metadata table
-- Uses UPSERT to handle existing data without conflicts

INSERT INTO seo_metadata (page, title, description, keywords) VALUES
('home', 'Leatex - Kvaliteetsed kotid ja pakendid', 'Kvaliteetsed puuvillakotid, paberkotid, paelaga kotid ja pakendid kohandatud trükiga. Küsi pakkumist juba täna!', 'kotid, pakendid, puuvillakotid, paberkotid, nööriga kotid, sussikotid, trükk, personaliseerimine'),
('products', 'Tooted - Leatex Kotid ja Pakendid', 'Vaata meie kvaliteetsete kottide ja pakendite valikut. Puuvillakotid, paberkotid, nööriga kotid ja sussikotid.', 'tooted, kotid, pakendid, puuvillakotid, paberkotid, nööriga kotid, sussikotid'),
('cotton-bags', 'Riidest Kotid - Kvaliteetsed Puuvillakotid', 'Kvaliteetsed riidest kotid ja puuvillakotid erinevates suurustes ja värvides. Kohandatud trükk ja personaliseerimine.', 'riidest kotid, puuvillakotid, kohandatud trükk, personaliseerimine, kvaliteet'),
('paper-bags', 'Paberkotid - Keskkonnasõbralikud Pakendid', 'Keskkonnasõbralikud paberkotid teie brändile. Taaskasutatud materjal, vastupidav ja ökoloogiline.', 'paberkotid, keskkonnasõbralikud, taaskasutatud materjal, ökoloogiline'),
('drawstring-bags', 'Nööriga Kotid - Mugavad Seljakotid', 'Mugavad nööriga kotid spordivahenditele ja väikestele esemetele. Reguleeritavad nöörid ja erinevad materjalid.', 'nööriga kotid, seljakotid, spordivahendid, reguleeritavad nöörid'),
('shoebags', 'Sussikotid - Jalanõude Hoiustamine', 'Hingavad sussikotid jalanõude hoiustamiseks ja transportimiseks. Erinevad suurused ja hingavad materjalid.', 'sussikotid, jalanõud, hoiustamine, hingavad materjalid'),
('contact', 'Kontakt - Leatex Kotid ja Pakendid', 'Võta meiega ühendust ja küsi pakkumist kvaliteetsetele kottidele ja pakenditele. Kiire vastus ja professionaalne teenus.', 'kontakt, pakkumus, kotid, pakendid, professionaalne teenus'),
('about', 'Meist - Leatex Kotid ja Pakendid', 'Tutvu meie ettevõttega ja meie missiooniga pakkuda kvaliteetseid kotte ja pakendeid. Aastatepikkune kogemus.', 'meist, ettevõte, missioon, kogemus, kvaliteet'),
('portfolio', 'Portfoolio - Leatex Tööde Näited', 'Vaata meie portfooliot ja näe, milliseid kvaliteetseid kotte ja pakendeid oleme valmistanud meie klientidele.', 'portfoolio, tööde näited, kotid, pakendid, kliendid'),
('blog', 'Blogi - Leatex Kotid ja Pakendid', 'Loe meie blogist kasulikke artikleid kottide ja pakendite kohta, trendidest ja uutest toodetest.', 'blogi, artiklid, kotid, pakendid, trendid, uued tooted')
ON CONFLICT (page) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  updated_at = NOW();

-- Note: These entries will be automatically used by the DynamicSEO component
-- when users navigate to the corresponding pages
-- The ON CONFLICT clause ensures existing data is updated rather than causing errors 