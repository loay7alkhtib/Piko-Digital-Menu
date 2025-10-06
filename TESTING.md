# Testing Guide

This guide provides manual testing steps to verify the Piko Digital Menu functionality.

## Prerequisites

1. Ensure your Supabase database has the required schema with sample data
2. Set up environment variables (Supabase URL and anon key are already configured)
3. Run the development server: `npm run dev`

## Manual Testing Steps

### 1. Locale Switching & RTL Support

**Test Steps:**
1. Open the application in your browser
2. Click on the language toggle buttons (🇺🇸 English, 🇸🇦 العربية, 🇹🇷 Türkçe)
3. Verify the following for each locale:

**English (EN):**
- Text appears in English
- Layout direction is left-to-right (LTR)
- HTML `lang` attribute is set to "en"
- HTML `dir` attribute is set to "ltr"

**Arabic (AR):**
- Text appears in Arabic (if translated)
- Layout direction is right-to-left (RTL)
- HTML `lang` attribute is set to "ar"
- HTML `dir` attribute is set to "rtl"
- All UI elements should flip to RTL layout

**Turkish (TR):**
- Text appears in Turkish (if translated)
- Layout direction is left-to-right (LTR)
- HTML `lang` attribute is set to "tr"
- HTML `dir` attribute is set to "ltr"

**Expected Results:**
- Language preference persists after page refresh
- RTL layout works correctly for Arabic
- All text and UI elements adapt to the selected language

### 2. Public Menu Navigation

**Home Page:**
1. Navigate to `/` (home page)
2. Verify categories are displayed as cards/grid
3. Check that categories are ordered by `sort_order`
4. Click on a category card
5. Verify navigation to category page works

**Category Page:**
1. Navigate to `/[category-slug]`
2. Verify items are displayed with:
   - Item images (or placeholder)
   - Localized item names
   - Starting prices (minimum price from all sizes)
3. Click on an item card
4. Verify navigation to item detail page

**Item Detail Page:**
1. Navigate to `/item/[item-id]`
2. Verify item details include:
   - Large item image
   - Item name in current locale
   - Category name
   - Description (if available)
   - All available sizes and prices
3. Verify back navigation works

**Expected Results:**
- All pages load without errors
- Images display correctly or show placeholder
- Prices are formatted as Turkish Lira (e.g., "15 TL")
- Navigation breadcrumbs work properly

### 3. Admin Authentication

**Admin Login:**
1. Navigate to `/admin/login`
2. Try logging in with invalid credentials
3. Verify error message appears
4. Log in with valid staff credentials
5. Verify redirect to admin items page

**Access Control:**
1. Try accessing `/admin/items` without authentication
2. Verify redirect to login page
3. Try accessing with non-staff user
4. Verify access denied message

**Expected Results:**
- Only users with `profiles.role = 'staff'` can access admin
- Proper error messages for invalid login attempts
- Secure redirects for unauthorized access

### 4. Admin Item Management

**View Items:**
1. Access `/admin/items` as staff user
2. Verify items list displays:
   - Item thumbnails
   - Item names (English)
   - Category names
   - Sort order
   - Active/Draft status
3. Check that items are ordered by `sort_order`

**Edit Existing Item:**
1. Click "Edit" on an existing item
2. Verify edit drawer opens with current data
3. Modify item details:
   - Change names in different languages
   - Update description
   - Modify prices (add/remove sizes)
   - Upload new image
   - Toggle active status
4. Click "Update Item"
5. Verify changes are saved
6. Navigate to public menu and verify changes are reflected

**Add New Item:**
1. Click "Add New Item"
2. Fill in required fields:
   - Select category
   - Enter names in all languages
   - Add descriptions
   - Set prices for different sizes
   - Upload image
   - Set sort order
3. Toggle "Publish this item" to make it active
4. Click "Create Item"
5. Verify item appears in admin list
6. Verify item appears in public menu

**Toggle Item Status:**
1. Click "Deactivate" on an active item
2. Verify item status changes to "Draft"
3. Navigate to public menu
4. Verify item no longer appears
5. Click "Activate" on draft item
6. Verify item appears in public menu

**Expected Results:**
- All CRUD operations work correctly
- Image uploads to Supabase storage
- Multilingual content saves properly
- Draft/publish workflow functions correctly
- Changes reflect immediately in public menu

### 5. Responsive Design

**Mobile Testing:**
1. Open browser dev tools
2. Set viewport to mobile size (375px width)
3. Test all pages on mobile:
   - Home page category grid
   - Category page item grid
   - Item detail page
   - Admin interface
4. Verify touch interactions work
5. Check that text is readable
6. Verify buttons are appropriately sized

**Tablet Testing:**
1. Set viewport to tablet size (768px width)
2. Verify grid layouts adapt properly
3. Check that content is well-spaced

**Desktop Testing:**
1. Test on full desktop width (1200px+)
2. Verify optimal use of screen space
3. Check hover states and interactions

**Expected Results:**
- All layouts work on mobile, tablet, and desktop
- Text remains readable at all sizes
- Touch targets are appropriately sized
- Grid layouts adapt to screen size

### 6. Error Handling

**Network Errors:**
1. Disconnect internet connection
2. Try to load pages
3. Verify graceful error handling
4. Reconnect and verify recovery

**Invalid URLs:**
1. Navigate to non-existent category: `/nonexistent-category`
2. Navigate to non-existent item: `/item/invalid-id`
3. Verify 404 pages or proper error messages

**Database Errors:**
1. Test with empty database
2. Verify proper fallbacks for missing data
3. Check error messages are user-friendly

**Expected Results:**
- Graceful handling of all error conditions
- User-friendly error messages
- No application crashes

## Performance Testing

### Load Times
1. Measure initial page load time
2. Test image loading performance
3. Verify smooth transitions between pages

### Data Fetching
1. Test with large numbers of items
2. Verify pagination or performance with many categories
3. Check admin interface performance with many items

## Browser Compatibility

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility Testing

1. Test keyboard navigation
2. Verify screen reader compatibility
3. Check color contrast ratios
4. Test with reduced motion preferences
5. Verify focus indicators are visible

---

## Common Issues & Solutions

**Issue:** Categories not loading
**Solution:** Check Supabase connection and ensure categories table has data

**Issue:** Images not displaying
**Solution:** Verify Supabase storage bucket `menu-images` exists and has public access

**Issue:** Admin login fails
**Solution:** Ensure user has `profiles.role = 'staff'` in database

**Issue:** RTL layout not working
**Solution:** Check that Arabic text is properly set and CSS supports RTL

**Issue:** Price formatting incorrect
**Solution:** Verify price values are stored as cents (integers) in database
