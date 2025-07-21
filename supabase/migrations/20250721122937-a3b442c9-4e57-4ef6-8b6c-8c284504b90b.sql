-- Remove the unique constraint that prevents multiple entries with same section+key
DROP INDEX IF EXISTS footer_content_section_key_order_unique;