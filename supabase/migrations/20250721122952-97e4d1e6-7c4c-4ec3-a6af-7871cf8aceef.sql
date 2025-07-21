-- Remove the unique constraint that prevents multiple entries with same section+key
ALTER TABLE footer_content DROP CONSTRAINT IF EXISTS footer_content_section_key_order_unique;