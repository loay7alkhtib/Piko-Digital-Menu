-- Complete Arabic Menu Update
-- This script will update your database with the comprehensive Arabic menu
-- Run this in Supabase SQL Editor

-- Update existing categories with proper Arabic names
UPDATE category_i18n 
SET name = CASE 
  WHEN locale = 'ar' AND category_id = (SELECT id FROM categories WHERE slug = 'desserts') THEN 'الحلويات'
  WHEN locale = 'ar' AND category_id = (SELECT id FROM categories WHERE slug = 'beverages') THEN 'المشروبات'
END
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('desserts', 'beverages'));

-- Create new categories
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
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 'ar', 'السموذي والميلك شيك'),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 'en', 'Smoothies & Milk Shakes'),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 'tr', 'Smoothie & Milkshake'),
  ((SELECT id FROM categories WHERE slug = 'bubble-drinks'), 'ar', 'البابل درينكس'),
  ((SELECT id FROM categories WHERE slug = 'bubble-drinks'), 'en', 'Bubble Drinks'),
  ((SELECT id FROM categories WHERE slug = 'bubble-drinks'), 'tr', 'Bubble İçecekler'),
  ((SELECT id FROM categories WHERE slug = 'cold-drinks'), 'ar', 'المشروبات الباردة'),
  ((SELECT id FROM categories WHERE slug = 'cold-drinks'), 'en', 'Cold Drinks'),
  ((SELECT id FROM categories WHERE slug = 'cold-drinks'), 'tr', 'Soğuk İçecekler'),
  ((SELECT id FROM categories WHERE slug = 'hot-drinks'), 'ar', 'المشروبات الساخنة'),
  ((SELECT id FROM categories WHERE slug = 'hot-drinks'), 'en', 'Hot Drinks'),
  ((SELECT id FROM categories WHERE slug = 'hot-drinks'), 'tr', 'Sıcak İçecekler'),
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'ar', 'المشروبات التقليدية'),
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'en', 'Traditional Drinks'),
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'tr', 'Geleneksel İçecekler')
ON CONFLICT (category_id, locale) DO UPDATE SET
  name = EXCLUDED.name;

-- Clear existing items to start fresh
DELETE FROM items WHERE category_id IN (
  SELECT id FROM categories WHERE slug IN (
    'desserts', 'beverages', 'smoothies', 'bubble-drinks', 
    'cold-drinks', 'hot-drinks', 'traditional-drinks'
  )
);

-- DESSERTS (الحلويات) - 15 items
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
  ((SELECT id FROM categories WHERE slug = 'desserts'), 11, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 12, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 13, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 14, true),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 15, true);

-- Add dessert translations
INSERT INTO item_i18n (item_id, locale, name, description) VALUES
  -- Waffles
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'ar', 'وافل شوكولاتة', 'وافل مقرمش بالشوكولاتة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'en', 'Chocolate Waffle', 'Crispy chocolate waffle'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'tr', 'Çikolatalı Waffle', 'Çıtır çikolatalı waffle'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'ar', 'وافل فواكه', 'وافل بالفواكه الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'en', 'Fruit Waffle', 'Waffle with fresh fruits'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'tr', 'Meyveli Waffle', 'Taze meyveli waffle'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'ar', 'وافل فراولة', 'وافل بالفراولة الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'en', 'Strawberry Waffle', 'Waffle with fresh strawberries'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'tr', 'Çilekli Waffle', 'Taze çilekli waffle'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'ar', 'وافل لوتس', 'وافل بكريمة لوتس'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'en', 'Lotus Waffle', 'Waffle with lotus cream'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'tr', 'Lotus Waffle', 'Lotus kremalı waffle'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'ar', 'وافل أوريو', 'وافل بقطع أوريو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'en', 'Oreo Waffle', 'Waffle with Oreo pieces'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'tr', 'Oreo Waffle', 'Oreo parçalı waffle'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'ar', 'وافل فستق', 'وافل بالفستق الحلبي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'en', 'Pistachio Waffle', 'Waffle with pistachio'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'tr', 'Antep Fıstıklı Waffle', 'Antep fıstıklı waffle'),
  
  -- Crepes
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'ar', 'كريب تشيز كيك', 'كريب بالتشيز كيك'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'en', 'Cheesecake Crepe', 'Crepe with cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'tr', 'Cheesecake Krepi', 'Cheesecake krep'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'ar', 'كريب فيتوتشيني', 'كريب بالفيتوتشيني'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'en', 'Fettuccine Crepe', 'Crepe with fettuccine'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'tr', 'Fettuccine Krepi', 'Fettuccine krep'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'ar', 'رول كريب موز فراولة', 'رول كريب بالموز والفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'en', 'Banana Strawberry Crepe Roll', 'Crepe roll with banana and strawberry'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'tr', 'Muz Çilekli Krepe Rulo', 'Muz ve çilekli krep rulo'),
  
  -- Pancakes
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'ar', 'ميني بان كيك بلوبيري + فراولة', 'ميني بان كيك بالبلوبيري والفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'en', 'Mini Blueberry + Strawberry Pancake', 'Mini pancake with blueberry and strawberry'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'tr', 'Mini Yaban Mersini + Çilekli Pancake', 'Yaban mersini ve çilekli mini pancake'),
  
  -- Cheesecakes
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'ar', 'تشمني كيك فواكه', 'تشمني كيك بالفواكه الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'en', 'Fruit Cheesecake', 'Cheesecake with fresh fruits'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'tr', 'Meyveli Cheesecake', 'Taze meyveli cheesecake'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 12), 'ar', 'تشمني كيك مارشميلو', 'تشمني كيك بالمارشميلو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 12), 'en', 'Marshmallow Cheesecake', 'Cheesecake with marshmallow'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 12), 'tr', 'Marshmallow Cheesecake', 'Marshmallow cheesecake'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 13), 'ar', 'تشمني كيك دبي', 'تشمني كيك بنكهة دبي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 13), 'en', 'Dubai Cheesecake', 'Dubai flavored cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 13), 'tr', 'Dubai Cheesecake', 'Dubai aromalı cheesecake'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 14), 'ar', 'تشمني كيك تيراميسو', 'تشمني كيك بنكهة التيراميسو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 14), 'en', 'Tiramisu Cheesecake', 'Tiramisu flavored cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 14), 'tr', 'Tiramisu Cheesecake', 'Tiramisu aromalı cheesecake'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 15), 'ar', 'تشمني كيك تفاح كراميل', 'تشمني كيك بالتفاح والكراميل'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 15), 'en', 'Apple Caramel Cheesecake', 'Cheesecake with apple and caramel'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 15), 'tr', 'Elma Karamelli Cheesecake', 'Elma ve karamelli cheesecake');

-- Add prices for desserts (35 TL = 3500 cents)
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

-- Add beverage translations
INSERT INTO item_i18n (item_id, locale, name, description) VALUES
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 1), 'ar', 'عصير برتقال', 'عصير برتقال طازج'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 1), 'en', 'Orange Juice', 'Fresh orange juice'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 1), 'tr', 'Portakal Suyu', 'Taze portakal suyu'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 2), 'ar', 'عصير تفاح', 'عصير تفاح طازج'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 2), 'en', 'Apple Juice', 'Fresh apple juice'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 2), 'tr', 'Elma Suyu', 'Taze elma suyu'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 3), 'ar', 'عصير جزر', 'عصير جزر طازج'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 3), 'en', 'Carrot Juice', 'Fresh carrot juice'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 3), 'tr', 'Havuç Suyu', 'Taze havuç suyu'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 4), 'ar', 'ليموناضة', 'ليموناضة طازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 4), 'en', 'Lemonade', 'Fresh lemonade'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages') AND sort_order = 4), 'tr', 'Limonata', 'Taze limonata');

-- Add prices for beverages (15 TL = 1500 cents)
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order, is_active) 
SELECT id, 'Regular', 1500, 0, true 
FROM items 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'beverages');

-- SMOOTHIES (السموذي والميلك شيك) - 15 items
INSERT INTO items (category_id, sort_order, is_active) VALUES
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 1, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 2, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 3, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 4, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 5, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 6, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 7, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 8, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 9, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 10, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 11, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 12, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 13, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 14, true),
  ((SELECT id FROM categories WHERE slug = 'smoothies'), 15, true);

-- Add smoothie translations
INSERT INTO item_i18n (item_id, locale, name, description) VALUES
  -- Mocha varieties
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 1), 'ar', 'موه كلاسيك', 'موه كلاسيكي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 1), 'en', 'Classic Mocha', 'Classic mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 1), 'tr', 'Klasik Mocha', 'Klasik mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 2), 'ar', 'موه فراولة', 'موه بالفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 2), 'en', 'Strawberry Mocha', 'Strawberry mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 2), 'tr', 'Çilekli Mocha', 'Çilekli mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 3), 'ar', 'موه أناناس', 'موه بالأناناس'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 3), 'en', 'Pineapple Mocha', 'Pineapple mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 3), 'tr', 'Ananaslı Mocha', 'Ananaslı mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 4), 'ar', 'موه مانجو', 'موه بالمانجو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 4), 'en', 'Mango Mocha', 'Mango mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 4), 'tr', 'Mangolu Mocha', 'Mangolu mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 5), 'ar', 'موه خوخ', 'موه بالخوخ'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 5), 'en', 'Peach Mocha', 'Peach mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 5), 'tr', 'Şeftalili Mocha', 'Şeftalili mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 6), 'ar', 'باشن أورانج', 'باشن برتقال'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 6), 'en', 'Passion Orange', 'Passion orange'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 6), 'tr', 'Passion Orange', 'Passion portakal'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 7), 'ar', 'باشن خوخ', 'باشن خوخ'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 7), 'en', 'Passion Peach', 'Passion peach'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 7), 'tr', 'Passion Şeftali', 'Passion şeftali'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 8), 'ar', 'رمان', 'موه بالرمان'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 8), 'en', 'Pomegranate', 'Pomegranate mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 8), 'tr', 'Nar', 'Narlı mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 9), 'ar', 'موه كيوي', 'موه بالكيوي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 9), 'en', 'Kiwi Mocha', 'Kiwi mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 9), 'tr', 'Kivili Mocha', 'Kivili mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 10), 'ar', 'موه كاريبيان', 'موه كاريبيان'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 10), 'en', 'Caribbean Mocha', 'Caribbean mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 10), 'tr', 'Karayip Mocha', 'Karayip mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 11), 'ar', 'موه زنجبيل', 'موه بالزنجبيل'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 11), 'en', 'Ginger Mocha', 'Ginger mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 11), 'tr', 'Zencefilli Mocha', 'Zencefilli mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 12), 'ar', 'موه ميكس بيري', 'موه بالفواكه المختلطة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 12), 'en', 'Mixed Berry Mocha', 'Mixed berry mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 12), 'tr', 'Karışık Meyveli Mocha', 'Karışık meyveli mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 13), 'ar', 'موه ليمون نعناع', 'موه بالليمون والنعناع'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 13), 'en', 'Lemon Mint Mocha', 'Lemon mint mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 13), 'tr', 'Limon Nane Mocha', 'Limon nane mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 14), 'ar', 'موه ليمون وردي', 'موه بالليمون الوردي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 14), 'en', 'Pink Lemon Mocha', 'Pink lemon mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 14), 'tr', 'Pembe Limon Mocha', 'Pembe limon mocha'),
  
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 15), 'ar', 'موه أناناس برتقال', 'موه بالأناناس والبرتقال'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 15), 'en', 'Pineapple Orange Mocha', 'Pineapple orange mocha'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies') AND sort_order = 15), 'tr', 'Ananas Portakal Mocha', 'Ananas portakal mocha');

-- Add prices for smoothies (25 TL = 2500 cents)
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order, is_active) 
SELECT id, 'Regular', 2500, 0, true 
FROM items 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'smoothies');

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
