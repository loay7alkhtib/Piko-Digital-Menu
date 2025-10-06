-- Create a test admin user
-- This will create a user and make them staff

-- First, create a user in the auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@piko-menu.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID we just created
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'admin@piko-menu.com'
)
-- Make them staff
INSERT INTO profiles (id, email, role)
SELECT id, 'admin@piko-menu.com', 'staff'
FROM new_user;

SELECT 'Test admin user created!' as status,
       'Email: admin@piko-menu.com' as email,
       'Password: admin123' as password;
