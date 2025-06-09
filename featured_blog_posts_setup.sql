-- Create featured_blog_posts table for managing blog posts that appear on /tooted page
CREATE TABLE IF NOT EXISTS featured_blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT,
  read_time TEXT DEFAULT '5 min',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for featured_blog_posts
ALTER TABLE featured_blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "featured_blog_posts_select_policy" ON featured_blog_posts
  FOR SELECT USING (true);

-- Allow authenticated users to insert, update, delete
CREATE POLICY "featured_blog_posts_insert_policy" ON featured_blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "featured_blog_posts_update_policy" ON featured_blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "featured_blog_posts_delete_policy" ON featured_blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add some sample featured blog posts
INSERT INTO featured_blog_posts (title, excerpt, image_url, read_time) VALUES
('Kuidas valida õiget kotti oma brändile', 'Praktilised nõuanded sobiva koti valimiseks, mis esindab teie brändi parimatel võimalikult.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop', '5 min'),
('Ökoloogilised pakendilahendused', 'Miks on oluline valida keskkonnasõbralikke pakendeid ja kuidas see mõjutab teie brändi mainet.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop', '3 min'),
('Trükikvaliteedi saladused', 'Millised on parimad praktikad kvaliteetse logo ja disaini trükkimiseks kottidele.', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop', '4 min'); 