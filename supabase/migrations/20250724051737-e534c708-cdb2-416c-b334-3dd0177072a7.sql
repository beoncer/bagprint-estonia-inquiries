-- Update the achievements section with proper Estonian content for portfolio page
UPDATE website_content 
SET value = 'Meie saavutused numbrites' 
WHERE page = 'portfolio' AND key = 'portfolio_achievements_title';

UPDATE website_content 
SET value = 'Oleme uhked oma saavutuste üle, mis näitavad meie pühendumust kvaliteetsele teenindusele ja klientide rahulolule.' 
WHERE page = 'portfolio' AND key = 'portfolio_achievements_description';

-- Achievement 1: Years in business
UPDATE website_content 
SET value = '10+' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_1_value';

UPDATE website_content 
SET value = 'aastat kogemust' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_1_label';

-- Achievement 2: Happy clients
UPDATE website_content 
SET value = '500+' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_2_value';

UPDATE website_content 
SET value = 'rahulolu klienti' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_2_label';

-- Achievement 3: Products delivered
UPDATE website_content 
SET value = '50,000+' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_3_value';

UPDATE website_content 
SET value = 'valmistatud kotti' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_3_label';

-- Achievement 4: Custom designs
UPDATE website_content 
SET value = '1,000+' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_4_value';

UPDATE website_content 
SET value = 'unikaalset disaini' 
WHERE page = 'portfolio' AND key = 'portfolio_achievement_4_label';