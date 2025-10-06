-- ========================================
-- PIKO DIGITAL MENU - FRESH START
-- Complete Database Setup from Scratch
-- ========================================

-- STEP 1: Drop all existing tables (if they exist)
-- ========================================
DROP TABLE IF EXISTS item_prices CASCADE;
DROP TABLE IF EXISTS item_i18n CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS category_i18n CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- STEP 2: Create all tables with correct structure
-- ========================================

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category i18n table (multilingual category names)
CREATE TABLE category_i18n (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar', 'tr')),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, locale),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Item i18n table (multilingual item content)
CREATE TABLE item_i18n (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ar', 'tr')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, locale),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Item prices table
CREATE TABLE item_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  size_name VARCHAR(100) NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Profiles table (user management)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- STEP 3: Enable Row Level Security
-- ========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create RLS Policies
-- ========================================

-- Public read policies (everyone can view active content)
CREATE POLICY "Public can view active categories" ON categories 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view category translations" ON category_i18n 
FOR SELECT USING (true);

CREATE POLICY "Public can view active items" ON items 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view item translations" ON item_i18n 
FOR SELECT USING (true);

CREATE POLICY "Public can view active item prices" ON item_prices 
FOR SELECT USING (is_active = true);

-- Staff write policies
CREATE POLICY "Staff can manage categories" ON categories 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage category translations" ON category_i18n 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage items" ON items 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage item translations" ON item_i18n 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage item prices" ON item_prices 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Profile policies
CREATE POLICY "Users can view their own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- STEP 5: Create Storage Bucket
-- ========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view menu images" ON storage.objects 
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

-- STEP 6: Create Indexes for Performance
-- ========================================
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_category_i18n_locale ON category_i18n(locale);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_sort_order ON items(sort_order);
CREATE INDEX idx_items_active ON items(is_active);
CREATE INDEX idx_item_i18n_locale ON item_i18n(locale);
CREATE INDEX idx_item_prices_item_id ON item_prices(item_id);
CREATE INDEX idx_item_prices_active ON item_prices(is_active);
CREATE INDEX idx_profiles_role ON profiles(role);

-- STEP 7: Insert Sample Categories
-- ========================================
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('appetizers', 1, true),
  ('main-courses', 2, true),
  ('desserts', 3, true),
  ('beverages', 4, true);

-- STEP 8: Insert Sample Category Translations
-- ========================================
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

-- STEP 9: Insert Sample Items
-- ========================================
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

-- STEP 10: Insert Sample Item Translations
-- ========================================
INSERT INTO item_i18n (item_id, locale, name, description)
-- Caesar Salad
SELECT i.id, 'en', 'Caesar Salad', 'Fresh romaine lettuce with parmesan cheese and croutons' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'سلطة قيصر', 'خس طازج مع جبن البارميزان والخبز المحمص' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Sezar Salatası', 'Parmesan peyniri ve krutonlu taze marul' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
-- Bruschetta
SELECT i.id, 'en', 'Bruschetta', 'Toasted bread topped with tomatoes, garlic, and basil' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'ar', 'بروشيتا', 'خبز محمص مع الطماطم والثوم والريحان' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'tr', 'Bruschetta', 'Domates, sarımsak ve fesleğenli kızarmış ekmek' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
-- Grilled Chicken
SELECT i.id, 'en', 'Grilled Chicken', 'Tender grilled chicken breast with herbs' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'دجاج مشوي', 'صدر دجاج طري مشوي مع الأعشاب' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Izgara Tavuk', 'Otlarla marine edilmiş yumuşak tavuk göğsü' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
-- Beef Steak
SELECT i.id, 'en', 'Beef Steak', 'Premium beef steak cooked to perfection' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'ar', 'ستيك اللحم البقري', 'ستيك لحم بقري مميز مطبوخ إلى الكمال' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'tr', 'Et Bifteği', 'Mükemmel pişirilmiş premium et bifteği' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
-- Tiramisu
SELECT i.id, 'en', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'تيراميسو', 'حلوى إيطالية كلاسيكية بالقهوة والمسكاربوني' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Tiramisu', 'Kahve ve mascarpone ile klasik İtalyan tatlısı' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
-- Turkish Coffee
SELECT i.id, 'en', 'Turkish Coffee', 'Traditional Turkish coffee with cardamom' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'ar', 'القهوة التركية', 'قهوة تركية تقليدية مع الهيل' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'tr', 'Türk Kahvesi', 'Kakule ile geleneksel Türk kahvesi' 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1;

-- STEP 11: Insert Sample Prices
-- ========================================
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order)
-- Caesar Salad prices
SELECT i.id, 'Regular', 1500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Large', 2200, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 1
UNION ALL
-- Bruschetta prices
SELECT i.id, 'Regular', 1200, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'Large', 1800, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'appetizers' AND i.sort_order = 2
UNION ALL
-- Grilled Chicken prices
SELECT i.id, 'Regular', 3500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
SELECT i.id, 'Large', 4500, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 1
UNION ALL
-- Beef Steak prices
SELECT i.id, 'Regular', 5500, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
SELECT i.id, 'Large', 7500, 1 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'main-courses' AND i.sort_order = 2
UNION ALL
-- Tiramisu price
SELECT i.id, 'Regular', 1800, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'desserts' AND i.sort_order = 1
UNION ALL
-- Turkish Coffee price
SELECT i.id, 'Regular', 800, 0 
FROM items i, categories c WHERE i.category_id = c.id AND c.slug = 'beverages' AND i.sort_order = 1;

-- STEP 12: Verification Query
-- ========================================
SELECT 
  'Database setup complete!' as status,
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM items) as items_count,
  (SELECT COUNT(*) FROM item_prices) as prices_count;

-- ========================================
-- NEXT STEPS:
-- ========================================
-- 1. Go to Authentication → Users in Supabase
-- 2. Create a user or note an existing user's ID
-- 3. Run this query to make them staff:
--    INSERT INTO profiles (id, email, role) 
--    VALUES ('USER_ID_HERE', 'email@example.com', 'staff');
-- ========================================
