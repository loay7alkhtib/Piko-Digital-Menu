-- STEP 2: Enable Row Level Security and Create Policies
-- Run this AFTER step 1 is successful

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can view active content)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Category i18n is viewable by everyone" ON category_i18n FOR SELECT USING (true);
CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (is_active = true);
CREATE POLICY "Item i18n is viewable by everyone" ON item_i18n FOR SELECT USING (true);
CREATE POLICY "Item prices are viewable by everyone" ON item_prices FOR SELECT USING (is_active = true);

-- Staff write policies
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

-- Profile policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
