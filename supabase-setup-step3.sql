-- STEP 3: Create Storage Bucket and Policies
-- Run this AFTER step 2 is successful

-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for menu images
CREATE POLICY "Menu images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'menu-images');

CREATE POLICY "Staff can upload menu images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'menu-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can update menu images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'menu-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can delete menu images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'menu-images' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);
