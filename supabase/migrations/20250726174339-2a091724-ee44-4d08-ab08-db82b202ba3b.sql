-- Clear existing ordering FAQ entries
DELETE FROM website_content WHERE page = 'product_faq' AND key LIKE 'ordering_faq_%';

-- Insert comprehensive ordering FAQ content
INSERT INTO website_content (page, key, value) VALUES
-- FAQ 1: How to order
('product_faq', 'ordering_faq_0_question', 'Kuidas ma saan oma tellimuse esitada?'),
('product_faq', 'ordering_faq_0_answer', 'Tellimuse esitamiseks täitke meie veebilehe päringuvormi vajaliku tootega. Saatke oma kontaktandmed ja toote üksikasjad ning me võtame teiega 24 tunni jooksul ühendust personaalse hinnapakkumise ja tellimuse kinnitamiseks.'),

-- FAQ 2: Samples
('product_faq', 'ordering_faq_1_question', 'Kas saan tellida tootenäidiseid?'),
('product_faq', 'ordering_faq_1_answer', 'Jah, saadame meeleldi füüsilisi tootenäidiseid, et saaksite materjali kvaliteeti ja värvust hinnata. Näidised saadetakse tavaliselt 2-3 tööpäeva jooksul. Väiksemad näidised on tasuta, suuremad võivad nõuda väikest tasu.'),

-- FAQ 3: Digital proof
('product_faq', 'ordering_faq_2_question', 'Kas saan näha oma disaini eelvaatet enne tootmist?'),
('product_faq', 'ordering_faq_2_answer', 'Kindlasti! Enne tootmise alustamist saadame teile digitaalse eelvaate, mis näitab täpselt, kuidas teie disain tootel välja näeb. Saate teha vajalikud muudatused enne lõpliku kinnituse andmist.'),

-- FAQ 4: Payment terms
('product_faq', 'ordering_faq_3_question', 'Millised on maksetingimused?'),
('product_faq', 'ordering_faq_3_answer', 'Tavaliselt nõuame 50% ettemaksu tellimuse kinnitamisel ja ülejäänud summa enne kauba väljasaatmist. Suurematel tellimustel võime pakkuda paindlikumaid maksetingimusi. Aktsepteerime pangaülekandeid ja arveldame käibemaksuga.'),

-- FAQ 5: Printing options
('product_faq', 'ordering_faq_4_question', 'Millised on trükkimise võimalused?'),
('product_faq', 'ordering_faq_4_answer', 'Pakume mitmesuguseid trükkimise tehnikaid: serigraafia (kuni 8 värvi), digitaalne trükk täisvärviliste disainide jaoks, ning soojapresstrükk väiksematele kogustele. Valik sõltub materjalist, kogusest ja soovitud kvaliteedist.'),

-- FAQ 6: Delivery time
('product_faq', 'ordering_faq_5_question', 'Kui kiiresti tellimus valmib?'),
('product_faq', 'ordering_faq_5_answer', 'Tootmisaeg sõltub tellimuse mahust ja keerukusest. Tavaliselt on trükiga tooted valmis 7-14 tööpäeva jooksul. Kiireloomuliste tellimuste puhul võime pakkuda kiirendatud teenust lisatasu eest.'),

-- FAQ 7: Minimum order
('product_faq', 'ordering_faq_6_question', 'Milline on minimaalne tellimuskogus?'),
('product_faq', 'ordering_faq_6_answer', 'Minimaalne tellimuskogus trükiga toodete puhul on tavaliselt 50 tükki. Väiksemaid koguseid saame toota kõrgema ühikuhinnaga. Trükita toodete puhul ei ole minimaalset kogust.'),

-- FAQ 8: File requirements
('product_faq', 'ordering_faq_7_question', 'Millises formaadis peab disainifail olema?'),
('product_faq', 'ordering_faq_7_answer', 'Eelistame vektorfaile (AI, EPS, PDF) kõrgeima kvaliteedi tagamiseks. Aktsepteerime ka kõrgresolutsioonilisi rasterfaile (PNG, JPG) vähemalt 300 DPI kvaliteediga. Vajadusel aitame failide ettevalmistamisel.');