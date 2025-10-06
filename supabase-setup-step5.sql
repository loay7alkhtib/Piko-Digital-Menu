-- STEP 5: Create Your Staff User
-- Run this AFTER step 4 is successful

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with the actual user ID from your Supabase Auth users
-- To find your user ID:
-- 1. Go to Authentication → Users in your Supabase dashboard
-- 2. Create a new user or copy the ID of an existing user
-- 3. Replace 'YOUR_USER_ID_HERE' below with that ID
-- 4. Replace 'your-email@example.com' with the actual email

-- Example:
-- INSERT INTO profiles (id, email, role) 
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin@piko-menu.com', 'staff');

-- Uncomment and modify the line below:
INSERT INTO profiles (id, email, role) 
VALUES ('YOUR_USER_ID_HERE', 'your-email@example.com', 'staff');
