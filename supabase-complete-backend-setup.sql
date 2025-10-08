-- ========================================
-- PIKO DIGITAL MENU - COMPLETE BACKEND SETUP
-- Production-Ready Database Schema
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- STEP 1: DROP EXISTING TABLES (Clean Slate)
-- ========================================
DROP TABLE IF EXISTS item_prices CASCADE;
DROP TABLE IF EXISTS item_i18n CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS category_i18n CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ========================================
-- STEP 2: CREATE CORE TABLES
-- ========================================

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT categories_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT categories_sort_order_positive CHECK (sort_order >= 0)
);

-- Category i18n table (multilingual category names)
CREATE TABLE category_i18n (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL,
  locale VARCHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT category_i18n_locale_valid CHECK (locale IN ('en', 'ar', 'tr')),
  CONSTRAINT category_i18n_name_not_empty CHECK (length(trim(name)) > 0),
  UNIQUE(category_id, locale),
  
  -- Foreign key
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT items_sort_order_positive CHECK (sort_order >= 0),
  CONSTRAINT items_image_url_format CHECK (
    image_url IS NULL OR 
    image_url ~ '^https?://' OR 
    image_url ~ '^/[^/]'
  ),
  
  -- Foreign key
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Item i18n table (multilingual item content)
CREATE TABLE item_i18n (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID NOT NULL,
  locale VARCHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT item_i18n_locale_valid CHECK (locale IN ('en', 'ar', 'tr')),
  CONSTRAINT item_i18n_name_not_empty CHECK (length(trim(name)) > 0),
  UNIQUE(item_id, locale),
  
  -- Foreign key
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Item prices table
CREATE TABLE item_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID NOT NULL,
  size_name VARCHAR(100) NOT NULL,
  price_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT item_prices_price_positive CHECK (price_cents >= 0),
  CONSTRAINT item_prices_sort_order_positive CHECK (sort_order >= 0),
  CONSTRAINT item_prices_size_name_not_empty CHECK (length(trim(size_name)) > 0),
  
  -- Foreign key
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Profiles table (user management)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT profiles_role_valid CHECK (role IN ('customer', 'staff', 'admin')),
  CONSTRAINT profiles_email_format CHECK (
    email IS NULL OR 
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  
  -- Foreign key
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ========================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- Category i18n indexes
CREATE INDEX idx_category_i18n_category_id ON category_i18n(category_id);
CREATE INDEX idx_category_i18n_locale ON category_i18n(locale);
CREATE INDEX idx_category_i18n_name ON category_i18n(name);

-- Items indexes
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_sort_order ON items(sort_order);
CREATE INDEX idx_items_active ON items(is_active);
CREATE INDEX idx_items_created_at ON items(created_at);

-- Item i18n indexes
CREATE INDEX idx_item_i18n_item_id ON item_i18n(item_id);
CREATE INDEX idx_item_i18n_locale ON item_i18n(locale);
CREATE INDEX idx_item_i18n_name ON item_i18n(name);

-- Item prices indexes
CREATE INDEX idx_item_prices_item_id ON item_prices(item_id);
CREATE INDEX idx_item_prices_active ON item_prices(is_active);
CREATE INDEX idx_item_prices_sort_order ON item_prices(sort_order);
CREATE INDEX idx_item_prices_price_cents ON item_prices(price_cents);

-- Profiles indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ========================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: CREATE RLS POLICIES
-- ========================================

-- Categories policies
CREATE POLICY "Public can view active categories" ON categories 
FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage categories" ON categories 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Category i18n policies
CREATE POLICY "Public can view category translations" ON category_i18n 
FOR SELECT USING (true);

CREATE POLICY "Staff can manage category translations" ON category_i18n 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Items policies
CREATE POLICY "Public can view active items" ON items 
FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage items" ON items 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Item i18n policies
CREATE POLICY "Public can view item translations" ON item_i18n 
FOR SELECT USING (true);

CREATE POLICY "Staff can manage item translations" ON item_i18n 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Item prices policies
CREATE POLICY "Public can view active item prices" ON item_prices 
FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage item prices" ON item_prices 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ========================================
-- STEP 6: CREATE STORAGE BUCKET
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'menu-images', 
  'menu-images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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

-- ========================================
-- STEP 7: CREATE UPDATED_AT TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at 
  BEFORE UPDATE ON items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- STEP 8: INSERT SAMPLE DATA
-- ========================================

-- Insert categories
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('appetizers', 1, true),
  ('main-courses', 2, true),
  ('desserts', 3, true),
  ('beverages', 4, true);

-- Insert category translations
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

-- Insert sample prices
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

-- ========================================
-- STEP 9: VERIFICATION QUERIES
-- ========================================
SELECT 
  'Database setup complete!' as status,
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM items) as items_count,
  (SELECT COUNT(*) FROM item_prices) as prices_count,
  (SELECT COUNT(*) FROM category_i18n) as category_translations_count,
  (SELECT COUNT(*) FROM item_i18n) as item_translations_count;

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- 
-- Next steps:
-- 1. Go to Authentication → Users in Supabase
-- 2. Create a user or note an existing user's ID
-- 3. Run this query to make them staff:
--    INSERT INTO profiles (id, email, role) 
--    VALUES ('USER_ID_HERE', 'email@example.com', 'staff');
-- 
-- Features included:
-- ✅ Complete database schema with constraints
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Storage bucket for images
-- ✅ Sample data with multilingual content
-- ✅ Automatic timestamp updates
-- ✅ Data validation constraints
-- ✅ Foreign key relationships
-- ========================================
