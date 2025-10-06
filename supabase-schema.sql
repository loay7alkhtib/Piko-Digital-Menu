-- Piko Digital Menu Database Schema
-- Run this in your Supabase SQL Editor

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category i18n table
CREATE TABLE IF NOT EXISTS category_i18n (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar', 'tr')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, locale)
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item i18n table
CREATE TABLE IF NOT EXISTS item_i18n (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar', 'tr')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, locale)
);

-- Item prices table
CREATE TABLE IF NOT EXISTS item_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  size_name VARCHAR(100) NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Category i18n is viewable by everyone" ON category_i18n FOR SELECT USING (true);
CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (is_active = true);
CREATE POLICY "Item i18n is viewable by everyone" ON item_i18n FOR SELECT USING (true);
CREATE POLICY "Item prices are viewable by everyone" ON item_prices FOR SELECT USING (is_active = true);

-- RLS Policies for staff write access
CREATE POLICY "Staff can manage categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage category i18n" ON category_i18n FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage items" ON items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage item i18n" ON item_i18n FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage item prices" ON item_prices FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
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

-- Sample data for testing
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('appetizers', 1, true),
  ('main-courses', 2, true),
  ('desserts', 3, true),
  ('beverages', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Sample category translations
INSERT INTO category_i18n (category_id, locale, name) 
SELECT c.id, 'en', 'Appetizers' FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 'ar', 'المقبلات' FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 'tr', 'Mezeler' FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 'en', 'Main Courses' FROM categories c WHERE c.slug = 'main-courses'
UNION ALL
SELECT c.id, 'ar', 'الأطباق الرئيسية' FROM categories c WHERE c.slug = 'main-courses'
UNION ALL
SELECT c.id, 'tr', 'Ana Yemekler' FROM categories c WHERE c.slug = 'main-courses'
ON CONFLICT (category_id, locale) DO NOTHING;

-- Sample items
INSERT INTO items (category_id, sort_order, is_active) 
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 2, true FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'main-courses'
ON CONFLICT DO NOTHING;

-- Sample item translations
INSERT INTO item_i18n (item_id, locale, name, description)
SELECT i.id, 'en', 'Caesar Salad', 'Fresh romaine lettuce with parmesan cheese and croutons' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'سلطة قيصر', 'خس طازج مع جبن البارميزان والخبز المحمص' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Sezar Salatası', 'Parmesan peyniri ve krutonlu taze marul' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'en', 'Grilled Chicken', 'Tender grilled chicken breast with herbs' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'دجاج مشوي', 'صدر دجاج طري مشوي مع الأعشاب' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Izgara Tavuk', 'Otlarla marine edilmiş yumuşak tavuk göğsü' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
ON CONFLICT (item_id, locale) DO NOTHING;

-- Sample prices
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order)
SELECT i.id, 'Regular', 1500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Large', 2200, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Regular', 3500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Large', 4500, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
ON CONFLICT DO NOTHING;
