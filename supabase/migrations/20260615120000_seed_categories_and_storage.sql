/*
  # Seed Categories & Setup Storage

  ## Categories
  Inserts the main store categories for ABBYKRISTA OUTLET.

  ## Storage
  Creates a 'product-images' bucket for uploading product photos.
*/

-- Insert categories (using ON CONFLICT to avoid duplicates if run again)
INSERT INTO categories (name, slug, description, image_url, sort_order)
VALUES
  ('ABBYHAUS', 'abbyhaus', 'Kitchen, Living Room & Bedroom decor', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
  ('Fashion', 'fashion', 'Bags, Shoes, Shades, Jewelry & Hair Bands', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600', 2),
  ('Accessories', 'accessories', 'Phone Cases & More', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 3),
  ('Gadgets', 'gadgets', 'Phones, Tech & Smart Devices', 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600', 4),
  ('Preorder', 'preorder', 'Upcoming drops — reserve yours now', 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600', 5),
  ('Shoes', 'shoes', 'Sneakers, Heels, Slides & Sandals', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600', 6),
  ('Glasses', 'glasses', 'Sunglasses, Blue-light & Fashion Frames', 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600', 7),
  ('Dress', 'dress', 'Dresses for every occasion', 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600', 8),
  ('Decor', 'decor', 'Wall Art, Lighting & Home Accents', 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600', 9),
  ('Bags', 'bags', 'Handbags, Backpacks & Clutches', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600', 10),
  ('Jewelry', 'jewelry', 'Necklaces, Earrings, Rings & Bracelets', 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 11),
  ('Hair Accessories', 'hair-accessories', 'Hair Bands, Clips & Scrunchies', 'https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=600', 12)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      sort_order = EXCLUDED.sort_order;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Allow public read access to product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');
