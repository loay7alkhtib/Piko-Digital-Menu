-- STEP 4: Add Sample Data
-- Run this AFTER step 3 is successful

-- Insert sample categories
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('appetizers', 1, true),
  ('main-courses', 2, true),
  ('desserts', 3, true),
  ('beverages', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample category translations
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

-- Insert sample items
INSERT INTO items (category_id, sort_order, is_active) 
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 2, true FROM categories c WHERE c.slug = 'appetizers'
UNION ALL
SELECT c.id, 1, true FROM categories c WHERE c.slug = 'main-courses'
UNION ALL
SELECT c.id, 2, true FROM categories c WHERE c.slug = 'main-courses'
ON CONFLICT DO NOTHING;

-- Insert sample item translations
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
ON CONFLICT (item_id, locale) DO NOTHING;

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
ON CONFLICT DO NOTHING;
