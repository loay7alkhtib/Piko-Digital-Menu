-- Simple Menu Setup Script
-- This script will add your complete Arabic menu to the database

-- Clear existing data first
DELETE FROM item_prices WHERE item_id IN (SELECT id FROM items WHERE category_id IN (SELECT id FROM categories));
DELETE FROM item_i18n WHERE item_id IN (SELECT id FROM items WHERE category_id IN (SELECT id FROM categories));
DELETE FROM items WHERE category_id IN (SELECT id FROM categories);
DELETE FROM category_i18n WHERE category_id IN (SELECT id FROM categories);
DELETE FROM categories;

-- Insert categories
INSERT INTO categories (slug, sort_order, is_active) VALUES
  ('desserts', 1, true),
  ('beverages', 2, true),
  ('smoothies', 3, true),
  ('bubble-drinks', 4, true),
  ('cold-drinks', 5, true),
  ('hot-drinks', 6, true),
  ('traditional-drinks', 7, true);

-- Insert category translations
INSERT INTO category_i18n (category_id, locale, name) VALUES
  -- Desserts
  ((SELECT id FROM categories WHERE slug = 'desserts'), 'ar', 'الحلويات'),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 'en', 'Desserts'),
  ((SELECT id FROM categories WHERE slug = 'desserts'), 'tr', 'Tatlılar'),
  
  -- Beverages
  ((SELECT id FROM categories WHERE slug = 'beverages'), 'ar', 'المشروبات'),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 'en', 'Beverages'),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 'tr', 'İçecekler'),
  
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
  ((SELECT id FROM categories WHERE slug = 'traditional-drinks'), 'tr', 'Geleneksel İçecekler');

-- Insert desserts (15 items)
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

-- Insert dessert translations
INSERT INTO item_i18n (item_id, locale, name, description) VALUES
  -- Item 1: Chocolate Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'ar', 'وافل شوكولاتة', 'وافل مقرمش بالشوكولاتة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'en', 'Chocolate Waffle', 'Crispy chocolate waffle'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 1), 'tr', 'Çikolatalı Waffle', 'Çıtır çikolatalı waffle'),
  
  -- Item 2: Fruit Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'ar', 'وافل فواكه', 'وافل بالفواكه الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'en', 'Fruit Waffle', 'Waffle with fresh fruits'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 2), 'tr', 'Meyveli Waffle', 'Taze meyveli waffle'),
  
  -- Item 3: Strawberry Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'ar', 'وافل فراولة', 'وافل بالفراولة الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'en', 'Strawberry Waffle', 'Waffle with fresh strawberries'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 3), 'tr', 'Çilekli Waffle', 'Taze çilekli waffle'),
  
  -- Item 4: Lotus Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'ar', 'وافل لوتس', 'وافل بكريمة لوتس'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'en', 'Lotus Waffle', 'Waffle with lotus cream'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 4), 'tr', 'Lotus Waffle', 'Lotus kremalı waffle'),
  
  -- Item 5: Oreo Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'ar', 'وافل أوريو', 'وافل بقطع أوريو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'en', 'Oreo Waffle', 'Waffle with Oreo pieces'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 5), 'tr', 'Oreo Waffle', 'Oreo parçalı waffle'),
  
  -- Item 6: Pistachio Waffle
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'ar', 'وافل فستق', 'وافل بالفستق الحلبي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'en', 'Pistachio Waffle', 'Waffle with pistachio'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 6), 'tr', 'Antep Fıstıklı Waffle', 'Antep fıstıklı waffle'),
  
  -- Item 7: Cheesecake Crepe
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'ar', 'كريب تشيز كيك', 'كريب بالتشيز كيك'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'en', 'Cheesecake Crepe', 'Crepe with cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 7), 'tr', 'Cheesecake Krepi', 'Cheesecake krep'),
  
  -- Item 8: Fettuccine Crepe
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'ar', 'كريب فيتوتشيني', 'كريب بالفيتوتشيني'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'en', 'Fettuccine Crepe', 'Crepe with fettuccine'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 8), 'tr', 'Fettuccine Krepi', 'Fettuccine krep'),
  
  -- Item 9: Banana Strawberry Crepe Roll
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'ar', 'رول كريب موز فراولة', 'رول كريب بالموز والفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'en', 'Banana Strawberry Crepe Roll', 'Crepe roll with banana and strawberry'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 9), 'tr', 'Muz Çilekli Krepe Rulo', 'Muz ve çilekli krep rulo'),
  
  -- Item 10: Mini Pancake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'ar', 'ميني بان كيك بلوبيري + فراولة', 'ميني بان كيك بالبلوبيري والفراولة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'en', 'Mini Blueberry + Strawberry Pancake', 'Mini pancake with blueberry and strawberry'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 10), 'tr', 'Mini Yaban Mersini + Çilekli Pancake', 'Yaban mersini ve çilekli mini pancake'),
  
  -- Item 11: Fruit Cheesecake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'ar', 'تشمني كيك فواكه', 'تشمني كيك بالفواكه الطازجة'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'en', 'Fruit Cheesecake', 'Cheesecake with fresh fruits'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 11), 'tr', 'Meyveli Cheesecake', 'Taze meyveli cheesecake'),
  
  -- Item 12: Marshmallow Cheesecake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 12), 'ar', 'تشمني كيك مارشميلو', 'تشمني كيك بالمارشميلو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 12), 'en', 'Marshmallow Cheesecake', 'Cheesecake with marshmallow'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 12), 'tr', 'Marshmallow Cheesecake', 'Marshmallow cheesecake'),
  
  -- Item 13: Dubai Cheesecake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 13), 'ar', 'تشمني كيك دبي', 'تشمني كيك بنكهة دبي'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 13), 'en', 'Dubai Cheesecake', 'Dubai flavored cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 13), 'tr', 'Dubai Cheesecake', 'Dubai aromalı cheesecake'),
  
  -- Item 14: Tiramisu Cheesecake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 14), 'ar', 'تشمني كيك تيراميسو', 'تشمني كيك بنكهة التيراميسو'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 14), 'en', 'Tiramisu Cheesecake', 'Tiramisu flavored cheesecake'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 14), 'tr', 'Tiramisu Cheesecake', 'Tiramisu aromalı cheesecake'),
  
  -- Item 15: Apple Caramel Cheesecake
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 15), 'ar', 'تشمني كيك تفاح كراميل', 'تشمني كيك بالتفاح والكراميل'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 15), 'en', 'Apple Caramel Cheesecake', 'Cheesecake with apple and caramel'),
  ((SELECT id FROM items WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts') AND sort_order = 15), 'tr', 'Elma Karamelli Cheesecake', 'Elma ve karamelli cheesecake');

-- Add prices for desserts (35 TL = 3500 cents)
INSERT INTO item_prices (item_id, size_name, price_cents, sort_order, is_active) 
SELECT id, 'Regular', 3500, 0, true 
FROM items 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'desserts');

-- Insert beverages (4 items)
INSERT INTO items (category_id, sort_order, is_active) VALUES
  ((SELECT id FROM categories WHERE slug = 'beverages'), 1, true),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 2, true),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 3, true),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 4, true);

-- Insert beverage translations
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

-- Success message
SELECT 'Menu setup completed successfully! Your website now has Arabic menu items.' as status;
