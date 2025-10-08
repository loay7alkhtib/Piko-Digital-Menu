-- Update Menu with Comprehensive Arabic Content
-- Run this script in Supabase SQL Editor

-- First, let's update existing categories with Arabic names
UPDATE category_i18n 
SET name = CASE 
  WHEN locale = 'ar' AND category_id = (SELECT id FROM categories WHERE slug = 'desserts') THEN 'الحلويات'
  WHEN locale = 'ar' AND category_id = (SELECT id FROM categories WHERE slug = 'beverages') THEN 'المشروبات'
  WHEN locale = 'en' AND category_id = (SELECT id FROM categories WHERE slug = 'desserts') THEN 'Desserts'
  WHEN locale = 'en' AND category_id = (SELECT id FROM categories WHERE slug = 'beverages') THEN 'Beverages'
  WHEN locale = 'tr' AND category_id = (SELECT id FROM categories WHERE slug = 'desserts') THEN 'Tatlılar'
  WHEN locale = 'tr' AND category_id = (SELECT id FROM categories WHERE slug = 'beverages') THEN 'İçecekler'
END
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('desserts', 'beverages'));

-- Create new categories for the comprehensive menu
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('smoothies', 3, true),
  ('bubble-drinks', 4, true),
  ('cold-drinks', 5, true),
  ('hot-drinks', 6, true),
  ('traditional-drinks', 7, true)
ON CONFLICT (slug) DO UPDATE SET
  is_active = true,
  sort_order = EXCLUDED.sort_order;

-- Add translations for new categories
INSERT INTO category_i18n (category_id, locale, name) VALUES
  -- Smoothies
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 'ar', 'السموذي والميلك شيك'),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 'en', 'Smoothies & Milk Shakes'),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 'tr', 'Smoothie & Milkshake'),
  
  -- Bubble Drinks
  ((SELECT id FROM categories WHERE slug = 'bubble-drinks'), 'ar', 'البابل درينكس'),
  ((SELECT id FROM categories WHERE slug = 'bubble-drinks'), 'en', 'Bubble Drinks'),
  ((SELECT id FROM categories WHERE slug = 'bubble-drinks'), 'tr', 'Bubble İçecekler'),
  
  -- Cold Drinks
  ((SELECT id FROM categories WHERE slug = 'cold-drinks'), 'ar', 'المشروبات الباردة'),
  ((SELECT id FROM categories WHERE slug = 'cold-drinks'), 'en', 'Cold Drinks'),
  ((SELECT id FROM categories WHERE slug = 'cold-drinks'), 'tr', 'Soğuk İçecekler'),
  
  -- Hot Drinks
  ((SELECT id FROM categories WHERE slug = 'hot-drinks'), 'ar', 'المشروبات الساخنة'),
  ((SELECT id FROM categories WHERE slug = 'hot-drinks'), 'en', 'Hot Drinks'),
  ((SELECT id FROM categories WHERE slug = 'hot-drinks'), 'tr', 'Sıcak İçecekler'),
  
  -- Traditional Drinks
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'ar', 'المشروبات التقليدية'),
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'en', 'Traditional Drinks'),
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'tr', 'Geleneksel İçecekler')
ON CONFLICT (category_id, locale) DO UPDATE SET
  name = EXCLUDED.name;

-- Clear existing items and start fresh
DELETE FROM items WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('desserts', 'beverages', 'smoothies', 'bubble-drinks', 'cold-drinks', 'hot-drinks', 'traditional-drinks'));

-- Insert new items for each category
-- DESSERTS (الحلويات)
INSERT INTO items (category_id, sort_order, is_active) VALUES
  ((SELECT id FROM categories WHERE slug = 'desserts'), 1, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 2, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 3, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 4, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 5, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 6, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 7, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 8, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 9, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 10, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 11, true);

-- Add translations for dessert items
INSERT INTO item_i18n (item_id, locale, name, description) VALUES
  -- Chocolate Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'ar', 'وافل شوكولاتة', 'وافل مقرمش بالشوكولاتة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'en', 'Chocolate Waffle', 'Crispy waffle with chocolate'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'tr', 'Çikolatalı Waffle', 'Çikolatalı çıtır waffle'),
  
  -- Fruit Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'ar', 'وافل فواكه', 'وافل طازج بالفواكه الموسمية'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'en', 'Fruit Waffle', 'Fresh waffle with seasonal fruits'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'tr', 'Meyveli Waffle', 'Mevsim meyveleriyle taze waffle'),
  
  -- Strawberry Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'ar', 'وافل فراولة', 'وافل بالفراولة الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'en', 'Strawberry Waffle', 'Waffle with fresh strawberries'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'tr', 'Çilekli Waffle', 'Taze çilekli waffle'),
  
  -- Lotus Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'ar', 'وافل لوتس', 'وافل بكريمة لوتس'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'en', 'Lotus Waffle', 'Waffle with lotus cream'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'tr', 'Lotus Waffle', 'Lotus kremalı waffle'),
  
  -- Oreo Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'ar', 'وافل أوريو', 'وافل بقطع أوريو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'en', 'Oreo Waffle', 'Waffle with Oreo pieces'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'tr', 'Oreo Waffle', 'Oreo parçalı waffle'),
  
  -- Pistachio Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'ar', 'وافل فستق', 'وافل بالفستق الحلبي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'en', 'Pistachio Waffle', 'Waffle with pistachio'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'tr', 'Antep Fıstıklı Waffle', 'Antep fıstıklı waffle'),
  
  -- Cheesecake Crepe
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'ar', 'كريب تشيز كيك', 'كريب بالتشيز كيك'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'en', 'Cheesecake Crepe', 'Crepe with cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'tr', 'Cheesecake Krepi', 'Cheesecake krep'),
  
  -- Fettuccine Crepe
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'ar', 'كريب فيتوتشيني', 'كريب بالفيتوتشيني'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'en', 'Fettuccine Crepe', 'Crepe with fettuccine'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'tr', 'Fettuccine Krepi', 'Fettuccine krep'),
  
  -- Banana Strawberry Crepe Roll
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'ar', 'رول كريب موز فراولة', 'رول كريب بالموز والفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'en', 'Banana Strawberry Crepe Roll', 'Crepe roll with banana and strawberry'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'tr', 'Muz Çilekli Krepe Rulo', 'Muz ve çilekli krep rulo'),
  
  -- Mini Pancake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'ar', 'ميني بان كيك بلوبيري + فراولة', 'ميني بان كيك بالبلوبيري والفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'en', 'Mini Blueberry + Strawberry Pancake', 'Mini pancake with blueberry and strawberry'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'tr', 'Mini Yaban Mersini + Çilekli Pancake', 'Yaban mersini ve çilekli mini pancake'),
  
  -- Cheesecake Varieties
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'ar', 'تشمني كيك متنوع', 'تشمني كيك بجميع النكهات'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'en', 'Variety Cheesecakes', 'Cheesecake with various flavors'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'tr', 'Çeşitli Cheesecake', 'Çeşitli aromalı cheesecake');

-- Add prices for dessert items (all 35 TL = 3500 cents)
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order, is_active) 
SELECT id, 'Regular', 3500, 0, true 
FROM items 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts');

-- BEVERAGES (المشروبات) - Juices
INSERT INTO items (category_id, sort_order, is_active) VALUES
  ((SELECT id FROM categories WHERE slug = 'beverages'), 1, true),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 2, true),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 3, true),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 4, true);

-- Add translations for beverage items
INSERT INTO item_i18n (item_id, locale, name, description) VALUES
  -- Orange Juice
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 1), 'ar', 'عصير برتقال', 'عصير برتقال طازج'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 1), 'en', 'Orange Juice', 'Fresh orange juice'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 1), 'tr', 'Portakal Suyu', 'Taze portakal suyu'),
  
  -- Apple Juice
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 2), 'ar', 'عصير تفاح', 'عصير تفاح طازج'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 2), 'en', 'Apple Juice', 'Fresh apple juice'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 2), 'tr', 'Elma Suyu', 'Taze elma suyu'),
  
  -- Carrot Juice
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 3), 'ar', 'عصير جزر', 'عصير جزر طازج'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 3), 'en', 'Carrot Juice', 'Fresh carrot juice'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 3), 'tr', 'Havuç Suyu', 'Taze havuç suyu'),
  
  -- Lemonade
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 4), 'ar', 'ليموناضة', 'ليموناضة طازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 4), 'en', 'Lemonade', 'Fresh lemonade'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 4), 'tr', 'Limonata', 'Taze limonata');

-- Add prices for beverage items (15 TL = 1500 cents)
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order, is_active) 
SELECT id, 'Regular', 1500, 0, true 
FROM items 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages');

-- Verification query
SELECT 
  c.slug as category_slug,
  ci.name as category_name,
  ci.locale,
  COUNT(i.id) as item_count
FROM categories c
LEFT JOIN category_i18n ci ON c.id = ci.category_id
LEFT JOIN items i ON c.id = i.category_id AND i.is_active = true
WHERE c.slug IN ('desserts', 'beverages', 'smoothies', 'bubble-drinks', 'cold-drinks', 'hot-drinks', 'traditional-drinks')
GROUP BY c.slug, ci.name, ci.locale
ORDER BY c.sort_order, ci.locale;
