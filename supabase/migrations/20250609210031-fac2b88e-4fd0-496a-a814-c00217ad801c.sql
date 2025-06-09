
-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images', 
  'blog-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create policy to allow public uploads to blog-images bucket
CREATE POLICY "Anyone can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

-- Create policy to allow public access to blog images
CREATE POLICY "Anyone can view blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Create policy to allow deleting blog images (for admins)
CREATE POLICY "Anyone can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');
