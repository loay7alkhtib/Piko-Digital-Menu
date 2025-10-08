#!/usr/bin/env node

/**
 * Update Menu with Arabic Content
 * Parses the provided Arabic menu and updates the database
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// Parse the Arabic menu text
function parseMenuText(text) {
  const categories = []
  const lines = text.split('\n').map(line => line.trim()).filter(line => line)
  
  let currentCategory = null
  let sortOrder = 1
  
  for (const line of lines) {
    // Skip empty lines and page numbers
    if (!line || line.includes('المنيو الكاملة') || /^\d+$/.test(line)) {
      continue
    }
    
    // Category indicators
    if (line.includes('الحلوي') || line.includes('وافل')) {
      currentCategory = {
        name: 'الحلويات',
        slug: 'desserts',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    } else if (line.includes('مشروبات') || line.includes('عصير') || line.includes('ليموناضة')) {
      currentCategory = {
        name: 'المشروبات',
        slug: 'beverages',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    } else if (line.includes('سموذي') || line.includes('موه') || line.includes('ميلك شيك')) {
      currentCategory = {
        name: 'السموذي والميلك شيك',
        slug: 'smoothies',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    } else if (line.includes('بابل درينكس') || line.includes('كوول لايم') || line.includes('كركديه')) {
      currentCategory = {
        name: 'البابل درينكس',
        slug: 'bubble-drinks',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    } else if (line.includes('مشروبات باردة') || line.includes('آيس') || line.includes('باردة')) {
      currentCategory = {
        name: 'المشروبات الباردة',
        slug: 'cold-drinks',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    } else if (line.includes('مشروبات ساخنة') || line.includes('إسبريسو') || line.includes('لاتيه') || line.includes('قهوة')) {
      currentCategory = {
        name: 'المشروبات الساخنة',
        slug: 'hot-drinks',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    } else if (line.includes('سحلب') || line.includes('شاي أعشاب') || line.includes('قهوة تركية')) {
      currentCategory = {
        name: 'المشروبات التقليدية',
        slug: 'traditional-drinks',
        items: [],
        sortOrder: sortOrder++
      }
      categories.push(currentCategory)
    }
    
    // Add items to current category
    else if (currentCategory && line && !line.includes('المنيو') && !line.includes('مشروبات') && !line.includes('الحلوي')) {
      // Clean up the item name
      let itemName = line
        .replace(/^[-\s]*/, '') // Remove leading dashes and spaces
        .replace(/[+\s]+$/, '') // Remove trailing spaces and plus signs
        .trim()
      
      if (itemName && itemName.length > 1) {
        currentCategory.items.push({
          name: itemName,
          sortOrder: currentCategory.items.length + 1
        })
      }
    }
  }
  
  return categories
}

// Create category in database
async function createCategory(categoryData) {
  try {
    // Check if category exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryData.slug)
      .single()
    
    if (existing) {
      logInfo(`Category ${categoryData.slug} already exists, updating...`)
      
      // Update existing category
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          sort_order: categoryData.sortOrder,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
      
      if (updateError) {
        logError(`Failed to update category ${categoryData.slug}: ${updateError.message}`)
        return null
      }
      
      // Update translations
      const { error: transError } = await supabase
        .from('category_i18n')
        .upsert({
          category_id: existing.id,
          locale: 'ar',
          name: categoryData.name,
          created_at: new Date().toISOString()
        }, { onConflict: 'category_id,locale' })
      
      if (transError) {
        logError(`Failed to update category translation: ${transError.message}`)
        return null
      }
      
      return existing.id
    } else {
      // Create new category
      const { data: category, error: catError } = await supabase
        .from('categories')
        .insert({
          slug: categoryData.slug,
          sort_order: categoryData.sortOrder,
          is_active: true
        })
        .select()
        .single()
      
      if (catError) {
        logError(`Failed to create category ${categoryData.slug}: ${catError.message}`)
        return null
      }
      
      // Create translations
      const translations = [
        { category_id: category.id, locale: 'ar', name: categoryData.name },
        { category_id: category.id, locale: 'en', name: getEnglishName(categoryData.slug) },
        { category_id: category.id, locale: 'tr', name: getTurkishName(categoryData.slug) }
      ]
      
      const { error: transError } = await supabase
        .from('category_i18n')
        .insert(translations)
      
      if (transError) {
        logError(`Failed to create category translations: ${transError.message}`)
        return null
      }
      
      return category.id
    }
  } catch (err) {
    logError(`Error creating/updating category: ${err.message}`)
    return null
  }
}

// Get English name for category
function getEnglishName(slug) {
  const names = {
    'desserts': 'Desserts',
    'beverages': 'Beverages',
    'smoothies': 'Smoothies & Milk Shakes',
    'bubble-drinks': 'Bubble Drinks',
    'cold-drinks': 'Cold Drinks',
    'hot-drinks': 'Hot Drinks',
    'traditional-drinks': 'Traditional Drinks'
  }
  return names[slug] || 'Category'
}

// Get Turkish name for category
function getTurkishName(slug) {
  const names = {
    'desserts': 'Tatlılar',
    'beverages': 'İçecekler',
    'smoothies': 'Smoothie & Milkshake',
    'bubble-drinks': 'Bubble İçecekler',
    'cold-drinks': 'Soğuk İçecekler',
    'hot-drinks': 'Sıcak İçecekler',
    'traditional-drinks': 'Geleneksel İçecekler'
  }
  return names[slug] || 'Kategori'
}

// Create item in database
async function createItem(itemData, categoryId) {
  try {
    // Check if item exists (by Arabic name)
    const { data: existing } = await supabase
      .from('items')
      .select(`
        id,
        item_i18n(name)
      `)
      .eq('category_id', categoryId)
      .eq('item_i18n.locale', 'ar')
      .eq('item_i18n.name', itemData.name)
      .single()
    
    if (existing) {
      logInfo(`Item "${itemData.name}" already exists, updating...`)
      
      // Update existing item
      const { error: updateError } = await supabase
        .from('items')
        .update({
          sort_order: itemData.sortOrder,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
      
      if (updateError) {
        logError(`Failed to update item: ${updateError.message}`)
        return false
      }
      
      return true
    } else {
      // Create new item
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          category_id: categoryId,
          sort_order: itemData.sortOrder,
          is_active: true
        })
        .select()
        .single()
      
      if (itemError) {
        logError(`Failed to create item: ${itemError.message}`)
        return false
      }
      
      // Create translations
      const translations = [
        { 
          item_id: item.id, 
          locale: 'ar', 
          name: itemData.name,
          description: null
        },
        { 
          item_id: item.id, 
          locale: 'en', 
          name: getEnglishItemName(itemData.name),
          description: null
        },
        { 
          item_id: item.id, 
          locale: 'tr', 
          name: getTurkishItemName(itemData.name),
          description: null
        }
      ]
      
      const { error: transError } = await supabase
        .from('item_i18n')
        .insert(translations)
      
      if (transError) {
        logError(`Failed to create item translations: ${transError.message}`)
        return false
      }
      
      // Create default price
      const { error: priceError } = await supabase
        .from('item_prices')
        .insert({
          item_id: item.id,
          size_name: 'Regular',
          price_cents: getDefaultPrice(itemData.name),
          sort_order: 0,
          is_active: true
        })
      
      if (priceError) {
        logError(`Failed to create item price: ${priceError.message}`)
        return false
      }
      
      return true
    }
  } catch (err) {
    logError(`Error creating/updating item: ${err.message}`)
    return false
  }
}

// Get English name for item (basic translation)
function getEnglishItemName(arabicName) {
  // Basic translation mapping
  const translations = {
    'وافل شوكولاتة': 'Chocolate Waffle',
    'وافل فواكه': 'Fruit Waffle',
    'وافل فراولة': 'Strawberry Waffle',
    'وافل لوتس': 'Lotus Waffle',
    'وافل أوريو': 'Oreo Waffle',
    'وافل فستق': 'Pistachio Waffle',
    'كريب تشيز كيك': 'Cheesecake Crepe',
    'كريب فيتوتشيني': 'Fettuccine Crepe',
    'رول كريب موز فراولة': 'Banana Strawberry Crepe Roll',
    'ميني بان كيك بلوبيري + فراولة': 'Mini Blueberry + Strawberry Pancake',
    'تشمني كيك فواكه': 'Fruit Cheesecake',
    'تشمني كيك مارشميلو': 'Marshmallow Cheesecake',
    'تشمني كيك دبي': 'Dubai Cheesecake',
    'تشمني كيك تيراميسو': 'Tiramisu Cheesecake',
    'تشمني كيك تفاح كراميل': 'Apple Caramel Cheesecake',
    'عصير برتقال': 'Orange Juice',
    'عصير تفاح': 'Apple Juice',
    'عصير جزر': 'Carrot Juice',
    'ليموناضة': 'Lemonade',
    'موه كلاسيك': 'Classic Mocha',
    'موه فراولة': 'Strawberry Mocha',
    'موه أناناس': 'Pineapple Mocha',
    'موه مانجو': 'Mango Mocha',
    'موه خوخ': 'Peach Mocha',
    'باشن أورانج': 'Passion Orange',
    'باشن خوخ': 'Passion Peach',
    'باشن رمان': 'Passion Pomegranate',
    'موه كيوي': 'Kiwi Mocha',
    'موه كاريبيان': 'Caribbean Mocha',
    'موه زنجبيل': 'Ginger Mocha',
    'موه ميكس بيري': 'Mixed Berry Mocha',
    'موه ليمون نعناع': 'Lemon Mint Mocha',
    'موه ليمون وردي': 'Pink Lemon Mocha',
    'موه أناناس برتقال': 'Pineapple Orange Mocha',
    'موه خوخ برتقال': 'Peach Orange Mocha',
    'موه باشن خوخ': 'Passion Peach Mocha',
    'موه باشن مانجو': 'Passion Mango Mocha',
    'موه باشن برتقال': 'Passion Orange Mocha',
    'موه كاريبيان': 'Caribbean Mocha',
    'موه فراولة': 'Strawberry Mocha',
    'موه فراولة نعناع': 'Strawberry Mint Mocha',
    'موه فراولة مانجو': 'Strawberry Mango Mocha',
    'ميلك شيك شوكولاتة': 'Chocolate Milkshake',
    'ميلك شيك فراولة': 'Strawberry Milkshake',
    'ميلك شيك فانيلا': 'Vanilla Milkshake',
    'ميلك شيك كراميل': 'Caramel Milkshake',
    'ميلك شيك لوتس': 'Lotus Milkshake',
    'ميلك شيك أوريو': 'Oreo Milkshake',
    'ميلك شيك كوكيز': 'Cookies Milkshake',
    'كوول لايم': 'Cool Lime',
    'كوول لايم + تفاح بابل': 'Cool Lime + Apple Bubble',
    'كوول لايم + فراولة بابل': 'Cool Lime + Strawberry Bubble',
    'كوول لايم + بلوبيري بابل': 'Cool Lime + Blueberry Bubble',
    'كركديه + تفاح بابل': 'Hibiscus + Apple Bubble',
    'كركديه + فراولة بابل': 'Hibiscus + Strawberry Bubble',
    'كركديه + بلوبيري بابل': 'Hibiscus + Blueberry Bubble',
    'فريش كوول لايم + مانجو': 'Fresh Cool Lime + Mango',
    'فريش كوول لايم + فراولة': 'Fresh Cool Lime + Strawberry',
    'فريش كركديه + فراولة': 'Fresh Hibiscus + Strawberry',
    'فريش كركديه + بلوبيري': 'Fresh Hibiscus + Blueberry',
    'فراولة بابل + نعناع + ليموناضة': 'Strawberry Bubble + Mint + Lemonade',
    'فراولة بابل + رمان + ليموناضة': 'Strawberry Bubble + Pomegranate + Lemonade',
    'فراولة بابل + فراولة + ليموناضة': 'Strawberry Bubble + Strawberry + Lemonade',
    'آيس أمريكانو': 'Iced Americano',
    'آيس لاتيه': 'Iced Latte',
    'آيس كراميل لاتيه': 'Iced Caramel Latte',
    'آيس فانيليا لاتيه': 'Iced Vanilla Latte',
    'آيس وايت شوكولاتة موكا': 'Iced White Chocolate Mocha',
    'آيس سبانيش لاتيه': 'Iced Spanish Latte',
    'آيس توفي نت لاتيه': 'Iced Toffee Nut Latte',
    'آيس كراميل ماكياتو': 'Iced Caramel Macchiato',
    'آيس فيلتر كوفي': 'Iced Filter Coffee',
    'كراميل بابل آيس لاتيه': 'Caramel Bubble Iced Latte',
    'كيراز تشيتشيك زين آيس لاتيه': 'Cherry Cheesecake Zen Iced Latte',
    'كوكونت زين آيس لاتيه': 'Coconut Zen Iced Latte',
    'آيس تشاي تي لاتيه': 'Iced Chai Tea Latte',
    'آيس موكا': 'Iced Mocha',
    'آيس زيبرا موكا': 'Iced Zebra Mocha',
    'آيس فراولة موكا': 'Iced Strawberry Mocha',
    'آيس بترسكوتش': 'Iced Butter Scotch',
    'آيس بيكو لاتيه': 'Iced Piccolo Latte',
    'آيس سولتد كراميل لاتيه': 'Iced Salted Caramel Latte',
    'إسبريسو': 'Espresso',
    'إسبريسو ريستريتو': 'Espresso Ristretto',
    'إسبريسو ماكياتو': 'Espresso Macchiato',
    'إسبريسو أفوجاتو': 'Espresso Affogato',
    'كورتادو': 'Cortado',
    'فلات وايت': 'Flat White',
    'سبانيش لاتيه': 'Spanish Latte',
    'تشيز كيك لاتيه': 'Cheesecake Latte',
    'بترسكوتش لاتيه': 'Butter Scotch Latte',
    'كراميل ماكياتو': 'Caramel Macchiato',
    'توفي نت لاتيه': 'Toffee Nut Latte',
    'شوكولاتة موكا': 'Chocolate Mocha',
    'وايت شوكولاتة موكا': 'White Chocolate Mocha',
    'زيبرا موكا': 'Zebra Mocha',
    'بيكو موكا': 'Piccolo Mocha',
    'فراولة موكا': 'Strawberry Mocha',
    'تشاي تي لاتيه': 'Chai Tea Latte',
    'هوت شوكولاتة': 'Hot Chocolate',
    'وايت هوت شوكولاتة': 'White Hot Chocolate',
    'سحلب': 'Sahlab',
    'شاي أعشاب': 'Herbal Tea',
    'قهوة تركية': 'Turkish Coffee',
    'قهوة عربية': 'Arabic Coffee',
    'شاي': 'Tea'
  }
  
  return translations[arabicName] || arabicName
}

// Get Turkish name for item (basic translation)
function getTurkishItemName(arabicName) {
  const translations = {
    'وافل شوكولاتة': 'Çikolatalı Waffle',
    'وافل فواكه': 'Meyveli Waffle',
    'وافل فراولة': 'Çilekli Waffle',
    'وافل لوتس': 'Lotus Waffle',
    'وافل أوريو': 'Oreo Waffle',
    'وافل فستق': 'Antep Fıstıklı Waffle',
    'كريب تشيز كيك': 'Cheesecake Krepi',
    'كريب فيتوتشيني': 'Fettuccine Krepi',
    'رول كريب موز فراولة': 'Muz Çilekli Krepe Rulo',
    'ميني بان كيك بلوبيري + فراولة': 'Mini Yaban Mersini + Çilekli Pancake',
    'تشمني كيك فواكه': 'Meyveli Cheesecake',
    'تشمني كيك مارشميلو': 'Marshmallow Cheesecake',
    'تشمني كيك دبي': 'Dubai Cheesecake',
    'تشمني كيك تيراميسو': 'Tiramisu Cheesecake',
    'تشمني كيك تفاح كراميل': 'Elma Karamelli Cheesecake',
    'عصير برتقال': 'Portakal Suyu',
    'عصير تفاح': 'Elma Suyu',
    'عصير جزر': 'Havuç Suyu',
    'ليموناضة': 'Limonata',
    'موه كلاسيك': 'Klasik Mocha',
    'موه فراولة': 'Çilekli Mocha',
    'موه أناناس': 'Ananaslı Mocha',
    'موه مانجو': 'Mangolu Mocha',
    'موه خوخ': 'Şeftalili Mocha',
    'باشن أورانج': 'Passion Orange',
    'باشن خوخ': 'Passion Şeftali',
    'باشن رمان': 'Passion Nar',
    'موه كيوي': 'Kivili Mocha',
    'موه كاريبيان': 'Karayip Mocha',
    'موه زنجبيل': 'Zencefilli Mocha',
    'موه ميكس بيري': 'Karışık Meyveli Mocha',
    'موه ليمون نعناع': 'Limon Nane Mocha',
    'موه ليمون وردي': 'Pembe Limon Mocha',
    'موه أناناس برتقال': 'Ananas Portakal Mocha',
    'موه خوخ برتقال': 'Şeftali Portakal Mocha',
    'موه باشن خوخ': 'Passion Şeftali Mocha',
    'موه باشن مانجو': 'Passion Mango Mocha',
    'موه باشن برتقال': 'Passion Portakal Mocha',
    'موه كاريبيان': 'Karayip Mocha',
    'موه فراولة': 'Çilekli Mocha',
    'موه فراولة نعناع': 'Çilek Nane Mocha',
    'موه فراولة مانجو': 'Çilek Mango Mocha',
    'ميلك شيك شوكولاتة': 'Çikolatalı Milkshake',
    'ميلك شيك فراولة': 'Çilekli Milkshake',
    'ميلك شيك فانيلا': 'Vanilyalı Milkshake',
    'ميلك شيك كراميل': 'Karamelli Milkshake',
    'ميلك شيك لوتس': 'Lotus Milkshake',
    'ميلك شيك أوريو': 'Oreo Milkshake',
    'ميلك شيك كوكيز': 'Kurabiyeli Milkshake',
    'كوول لايم': 'Cool Lime',
    'كوول لايم + تفاح بابل': 'Cool Lime + Elma Bubble',
    'كوول لايم + فراولة بابل': 'Cool Lime + Çilek Bubble',
    'كوول لايم + بلوبيري بابل': 'Cool Lime + Yaban Mersini Bubble',
    'كركديه + تفاح بابل': 'Hibiscus + Elma Bubble',
    'كركديه + فراولة بابل': 'Hibiscus + Çilek Bubble',
    'كركديه + بلوبيري بابل': 'Hibiscus + Yaban Mersini Bubble',
    'فريش كوول لايم + مانجو': 'Taze Cool Lime + Mango',
    'فريش كوول لايم + فراولة': 'Taze Cool Lime + Çilek',
    'فريش كركديه + فراولة': 'Taze Hibiscus + Çilek',
    'فريش كركديه + بلوبيري': 'Taze Hibiscus + Yaban Mersini',
    'فراولة بابل + نعناع + ليموناضة': 'Çilek Bubble + Nane + Limonata',
    'فراولة بابل + رمان + ليموناضة': 'Çilek Bubble + Nar + Limonata',
    'فراولة بابل + فراولة + ليموناضة': 'Çilek Bubble + Çilek + Limonata',
    'آيس أمريكانو': 'Buzlu Americano',
    'آيس لاتيه': 'Buzlu Latte',
    'آيس كراميل لاتيه': 'Buzlu Karamel Latte',
    'آيس فانيليا لاتيه': 'Buzlu Vanilyalı Latte',
    'آيس وايت شوكولاتة موكا': 'Buzlu Beyaz Çikolatalı Mocha',
    'آيس سبانيش لاتيه': 'Buzlu İspanyol Latte',
    'آيس توفي نت لاتيه': 'Buzlu Toffee Nut Latte',
    'آيس كراميل ماكياتو': 'Buzlu Karamel Macchiato',
    'آيس فيلتر كوفي': 'Buzlu Filtre Kahve',
    'كراميل بابل آيس لاتيه': 'Karamel Bubble Buzlu Latte',
    'كيراز تشيتشيك زين آيس لاتيه': 'Kiraz Cheesecake Zen Buzlu Latte',
    'كوكونت زين آيس لاتيه': 'Hindistan Cevizi Zen Buzlu Latte',
    'آيس تشاي تي لاتيه': 'Buzlu Chai Tea Latte',
    'آيس موكا': 'Buzlu Mocha',
    'آيس زيبرا موكا': 'Buzlu Zebra Mocha',
    'آيس فراولة موكا': 'Buzlu Çilekli Mocha',
    'آيس بترسكوتش': 'Buzlu Butter Scotch',
    'آيس بيكو لاتيه': 'Buzlu Piccolo Latte',
    'آيس سولتد كراميل لاتيه': 'Buzlu Tuzlu Karamel Latte',
    'إسبريسو': 'Espresso',
    'إسبريسو ريستريتو': 'Espresso Ristretto',
    'إسبريسو ماكياتو': 'Espresso Macchiato',
    'إسبريسو أفوجاتو': 'Espresso Affogato',
    'كورتادو': 'Cortado',
    'فلات وايت': 'Flat White',
    'سبانيش لاتيه': 'İspanyol Latte',
    'تشيز كيك لاتيه': 'Cheesecake Latte',
    'بترسكوتش لاتيه': 'Butter Scotch Latte',
    'كراميل ماكياتو': 'Karamel Macchiato',
    'توفي نت لاتيه': 'Toffee Nut Latte',
    'شوكولاتة موكا': 'Çikolatalı Mocha',
    'وايت شوكولاتة موكا': 'Beyaz Çikolatalı Mocha',
    'زيبرا موكا': 'Zebra Mocha',
    'بيكو موكا': 'Piccolo Mocha',
    'فراولة موكا': 'Çilekli Mocha',
    'تشاي تي لاتيه': 'Chai Tea Latte',
    'هوت شوكولاتة': 'Sıcak Çikolata',
    'وايت هوت شوكولاتة': 'Beyaz Sıcak Çikolata',
    'سحلب': 'Sahlep',
    'شاي أعشاب': 'Bitki Çayı',
    'قهوة تركية': 'Türk Kahvesi',
    'قهوة عربية': 'Arap Kahvesi',
    'شاي': 'Çay'
  }
  
  return translations[arabicName] || arabicName
}

// Get default price based on item type
function getDefaultPrice(itemName) {
  // Price in cents (Turkish Lira)
  if (itemName.includes('وافل') || itemName.includes('كريب') || itemName.includes('تشمني كيك')) {
    return 3500 // 35 TL for desserts
  } else if (itemName.includes('عصير') || itemName.includes('ليموناضة')) {
    return 1500 // 15 TL for juices
  } else if (itemName.includes('موه') || itemName.includes('سموذي')) {
    return 2500 // 25 TL for smoothies
  } else if (itemName.includes('ميلك شيك')) {
    return 2200 // 22 TL for milkshakes
  } else if (itemName.includes('بابل') || itemName.includes('كوول') || itemName.includes('كركديه')) {
    return 1800 // 18 TL for bubble drinks
  } else if (itemName.includes('آيس')) {
    return 2000 // 20 TL for iced drinks
  } else if (itemName.includes('إسبريسو') || itemName.includes('أمريكانو') || itemName.includes('لاتيه') || itemName.includes('كابتشينو')) {
    return 1800 // 18 TL for hot coffee
  } else if (itemName.includes('هوت شوكولاتة')) {
    return 1600 // 16 TL for hot chocolate
  } else if (itemName.includes('سحلب') || itemName.includes('شاي') || itemName.includes('قهوة')) {
    return 1200 // 12 TL for traditional drinks
  } else {
    return 1500 // 15 TL default
  }
}

// Main function to update menu
async function updateMenu() {
  log('🚀 Starting Menu Update with Arabic Content', 'bright')
  
  const menuText = `المنيو الكاملة 📖
ات 🍫
الحلوي
وفل شوكولاتة
وفل فواكه
وفل فراولة
وفل لوتس
وفل أوريو
وفل فستق
كريب تشيز كيك
كريب فيتوتشيني
رول كريب موز فراولة
ميني بان كيك بلوبيري + فراولة
تشمني كيك فواكه
تشمني كيك مارشميلو
تشمني كيك دبي
تشمني كيك تيراميسو
تشمني كيك تفاح كراميل
يش 🥤
ئر فر
عصا
عصير برتقال
عصير تفاح
عصير جزر
ليموناضة
🌱
1 المنيو الكاملة 📖
يتو 🌱
موه
كلاسيك
فراولة
أناناس
مانجو
خوخ
باشن أورانج
باشن خوخ
رمان
كيوي
كاريبيان
زنجبيل
ميكس بيري
موناضة 🥭
)Rami( سموذي & لي
سموذي ليمون نعناع
سموذي ليمون وردي
سموذي أناناس
سموذي أناناس برتقال
سموذي خوخ برتقال
سموذي باشن خوخ
سموذي باشن مانجو
سموذي مانجو
سموذي باشن برتقال
سموذي خوخ برتقال
2 المنيو الكاملة 📖
سموذي كاريبيان
سموذي فراولة
سموذي ميكس بيري
سموذي فراولة نعناع
سموذي فراولة مانجو
يلك شيك 🥛
م
شوكولاتة
فراولة
فانيلا
كراميل
لوتس
أوريو
كوكيز
بابل درينكس 🧋
كوول لايم
كوول لايم + تفاح بابل
كوول لايم + فراولة بابل
كوول لايم + بلوبيري بابل
كركديه + تفاح بابل
كركديه + فراولة بابل
كركديه + بلوبيري بابل
فريش ّ ا كوول لايم + مانجو
فريش ّ ا كوول لايم + فراولة
فريش ّ ا كركديه + فراولة
3 المنيو الكاملة 📖
فريش ّ ا كركديه + بلوبيري
فراولة بابل + نعناع + ليموناضة
فراولة بابل + رمان + ليموناضة
فراولة بابل + فراولة + ليموناضة
ش
روبات باردة 🧊
م
آيس أمريكانو
آيس لاتيه
آيس كراميل لاتيه
آيس فانيليا لاتيه
آيس وايت شوكولاتة موكا
آيس سبانيش لاتيه
آيس توفي نت لاتيه
آيس كراميل ماكياتو
آيس فيلتر كوفي
كراميل بابل آيس لاتيه
كيراز تشيتشيك زين آيس لاتيه
كوكونت زين آيس لاتيه
آيس تشاي تي لاتيه
آيس موكا
آيس زيبرا موكا
آيس فراولة موكا
آيس بترسكوتش
آيس بيكو لاتيه
آيس سولتد كراميل لاتيه
☕
4 المنيو الكاملة 📖
ش
روبات ساخنة ☕
إسبريسو
إسبريسو ريستريتو
إسبريسو ماكياتو
إسبريسو أفوجاتو
كورتادو
فلات وايت
لاتيه
أمريكانو
كابتشينو
سبانيش لاتيه
تشيز كيك لاتيه
بترسكوتش لاتيه
كراميل ماكياتو
كراميل لاتيه
فانيليا لاتيه
توفي نت لاتيه
شوكولاتة موكا
وايت شوكولاتة موكا
زيبرا موكا
بيكو موكا
فراولة موكا
تشاي تي لاتيه
هوت شوكولاتة
وايت هوت شوكولاتة
م
5 المنيو الكاملة 📖
سحلب
شاي أعشاب
قهوة تركية
قهوة عربية
شاي
6 المنيو الكاملة 📖`
  
  try {
    const categories = parseMenuText(menuText)
    
    log(`📊 Parsed ${categories.length} categories from menu`, 'cyan')
    
    for (const category of categories) {
      log(`\n📂 Processing category: ${category.name}`, 'magenta')
      
      const categoryId = await createCategory(category)
      if (!categoryId) {
        logError(`Failed to create category: ${category.name}`)
        continue
      }
      
      logSuccess(`Category "${category.name}" created/updated successfully`)
      logInfo(`Adding ${category.items.length} items...`)
      
      let successCount = 0
      for (const item of category.items) {
        const success = await createItem(item, categoryId)
        if (success) {
          successCount++
          logInfo(`  ✅ ${item.name}`)
        } else {
          logError(`  ❌ Failed to create item: ${item.name}`)
        }
      }
      
      logSuccess(`Successfully added ${successCount}/${category.items.length} items to "${category.name}"`)
    }
    
    log('\n🎉 Menu update completed!', 'bright')
    logInfo('All categories and items have been processed.')
    
  } catch (err) {
    logError(`Menu update failed: ${err.message}`)
    process.exit(1)
  }
}

// Run the update
updateMenu().catch(err => {
  logError(`Unexpected error: ${err.message}`)
  process.exit(1)
})
