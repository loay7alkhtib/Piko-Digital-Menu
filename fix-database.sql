-- Fix Database - Drop and Recreate Tables
-- Run this if you're getting column errors

-- Drop existing tables in correct order (due to foreign keys)
DROP TABLE IF EXISTS item_prices CASCADE;
DROP TABLE IF EXISTS item_i18n CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS category_i18n CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate tables
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE category_i18n (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar', 'tr')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, locale)
);

CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE item_i18n (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar', 'tr')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, locale)
);

CREATE TABLE item_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  size_name VARCHAR(100) NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Category i18n is viewable by everyone" ON category_i18n FOR SELECT USING (true);
CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (is_active = true);
CREATE POLICY "Item i18n is viewable by everyone" ON item_i18n FOR SELECT USING (true);
CREATE POLICY "Item prices are viewable by everyone" ON item_prices FOR SELECT USING (is_active = true);

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

-- Create storage bucket
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

-- Insert sample data
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('appetizers', 1, true),
  ('main-courses', 2, true),
  ('desserts', 3, true),
  ('beverages', 4, true);

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
UNION ALL
SELECT c.id, 'en', 'Desserts' FROM categories c WHERE c.slug = 'desserts'
UNION ALL
SELECT c.id, 'ar', 'الحلويات' FROM categories c WHERE c.slug = 'desserts'
UNION ALL
SELECT c.id, 'tr', 'Tatlılar' FROM categories c WHERE c.slug = 'desserts'
UNION ALL
SELECT c.id, 'en', 'Beverages' FROM categories c WHERE c.slug = 'beverages'
UNION ALL
SELECT c.id, 'ar', 'المشروبات' FROM categories c WHERE c.slug = 'beverages'
UNION ALL
SELECT c.id, 'tr', 'İçecekler' FROM categories c WHERE c.slug = 'beverages';

-- Insert sample items
INSERT INTO items (category_id, sort_order, is_active) 
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 2, true FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'main-courses'
UNION ALL
SELECT c.id, 2, true FROM categories c WHERE c.slug = 'main-courses'
UNION ALL
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'desserts'
UNION ALL
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'beverages';

-- Insert item translations
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
SELECT i.id, 'en', 'Bruschetta', 'Toasted bread topped with tomatoes, garlic, and basil' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'ar', 'بروشيتا', 'خبز محمص مع الطماطم والثوم والريحان' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'tr', 'Bruschetta', 'Domates, sarımsak ve fesleğenli kızarmış ekmek' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'en', 'Grilled Chicken', 'Tender grilled chicken breast with herbs' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'دجاج مشوي', 'صدر دجاج طري مشوي مع الأعشاب' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Izgara Tavuk', 'Otlarla marine edilmiş yumuşak tavuk göğsü' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'en', 'Beef Steak', 'Premium beef steak cooked to perfection' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'ar', 'ستيك اللحم البقري', 'ستيك لحم بقري مميز مطبوخ إلى الكمال' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'tr', 'Et Bifteği', 'Mükemmel pişirilmiş premium et bifteği' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'en', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'تيراميسو', 'حلوى إيطالية كلاسيكية بالقهوة والمسكاربوني' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Tiramisu', 'Kahve ve mascarpone ile klasik İtalyan tatlısı' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'en', 'Turkish Coffee', 'Traditional Turkish coffee with cardamom' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'القهوة التركية', 'قهوة تركية تقليدية مع الهيل' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Türk Kahvesi', 'Kakule ile geleneksel Türk kahvesi' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1;

-- Insert sample prices
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order)
SELECT i.id, 'Regular', 1500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Large', 2200, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Regular', 1200, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'Large', 1800, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'Regular', 3500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Large', 4500, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Regular', 5500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'Large', 7500, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'Regular', 1800, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Regular', 800, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1;

SELECT 'Database fixed and ready!' as status;
