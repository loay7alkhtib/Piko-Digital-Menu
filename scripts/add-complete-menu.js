#!/usr/bin/env node

/**
 * Add Complete Arabic Menu to Live Database
 * This script will populate your live Supabase database with all menu items
 */

const { createClient } = require('@supabase/supabase-js')

// Your live Supabase configuration
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

// Complete menu data
const menuData = {
  categories: [
    {
      slug: 'desserts',
      sortOrder: 1,
      translations: {
        ar: 'الحلويات',
        en: 'Desserts',
        tr: 'Tatlılar'
      },
      items: [
        { ar: 'وافل شوكولاتة', en: 'Chocolate Waffle', tr: 'Çikolatalı Waffle', price: 3500 },
        { ar: 'وافل فواكه', en: 'Fruit Waffle', tr: 'Meyveli Waffle', price: 3500 },
        { ar: 'وافل فراولة', en: 'Strawberry Waffle', tr: 'Çilekli Waffle', price: 3500 },
        { ar: 'وافل لوتس', en: 'Lotus Waffle', tr: 'Lotus Waffle', price: 3500 },
        { ar: 'وافل أوريو', en: 'Oreo Waffle', tr: 'Oreo Waffle', price: 3500 },
        { ar: 'وافل فستق', en: 'Pistachio Waffle', tr: 'Antep Fıstıklı Waffle', price: 3500 },
        { ar: 'كريب تشيز كيك', en: 'Cheesecake Crepe', tr: 'Cheesecake Krepi', price: 3500 },
        { ar: 'كريب فيتوتشيني', en: 'Fettuccine Crepe', tr: 'Fettuccine Krepi', price: 3500 },
        { ar: 'رول كريب موز فراولة', en: 'Banana Strawberry Crepe Roll', tr: 'Muz Çilekli Krepe Rulo', price: 3500 },
        { ar: 'ميني بان كيك بلوبيري + فراولة', en: 'Mini Blueberry + Strawberry Pancake', tr: 'Mini Yaban Mersini + Çilekli Pancake', price: 3500 },
        { ar: 'تشمني كيك فواكه', en: 'Fruit Cheesecake', tr: 'Meyveli Cheesecake', price: 3500 },
        { ar: 'تشمني كيك مارشميلو', en: 'Marshmallow Cheesecake', tr: 'Marshmallow Cheesecake', price: 3500 },
        { ar: 'تشمني كيك دبي', en: 'Dubai Cheesecake', tr: 'Dubai Cheesecake', price: 3500 },
        { ar: 'تشمني كيك تيراميسو', en: 'Tiramisu Cheesecake', tr: 'Tiramisu Cheesecake', price: 3500 },
        { ar: 'تشمني كيك تفاح كراميل', en: 'Apple Caramel Cheesecake', tr: 'Elma Karamelli Cheesecake', price: 3500 }
      ]
    },
    {
      slug: 'beverages',
      sortOrder: 2,
      translations: {
        ar: 'المشروبات',
        en: 'Beverages',
        tr: 'İçecekler'
      },
      items: [
        { ar: 'عصير برتقال', en: 'Orange Juice', tr: 'Portakal Suyu', price: 1500 },
        { ar: 'عصير تفاح', en: 'Apple Juice', tr: 'Elma Suyu', price: 1500 },
        { ar: 'عصير جزر', en: 'Carrot Juice', tr: 'Havuç Suyu', price: 1500 },
        { ar: 'ليموناضة', en: 'Lemonade', tr: 'Limonata', price: 1500 }
      ]
    },
    {
      slug: 'smoothies',
      sortOrder: 3,
      translations: {
        ar: 'السموذي والميلك شيك',
        en: 'Smoothies & Milk Shakes',
        tr: 'Smoothie & Milkshake'
      },
      items: [
        { ar: 'موه كلاسيك', en: 'Classic Mocha', tr: 'Klasik Mocha', price: 2500 },
        { ar: 'موه فراولة', en: 'Strawberry Mocha', tr: 'Çilekli Mocha', price: 2500 },
        { ar: 'موه أناناس', en: 'Pineapple Mocha', tr: 'Ananaslı Mocha', price: 2500 },
        { ar: 'موه مانجو', en: 'Mango Mocha', tr: 'Mangolu Mocha', price: 2500 },
        { ar: 'موه خوخ', en: 'Peach Mocha', tr: 'Şeftalili Mocha', price: 2500 },
        { ar: 'باشن أورانج', en: 'Passion Orange', tr: 'Passion Orange', price: 2500 },
        { ar: 'باشن خوخ', en: 'Passion Peach', tr: 'Passion Şeftali', price: 2500 },
        { ar: 'رمان', en: 'Pomegranate', tr: 'Nar', price: 2500 },
        { ar: 'موه كيوي', en: 'Kiwi Mocha', tr: 'Kivili Mocha', price: 2500 },
        { ar: 'موه كاريبيان', en: 'Caribbean Mocha', tr: 'Karayip Mocha', price: 2500 },
        { ar: 'موه زنجبيل', en: 'Ginger Mocha', tr: 'Zencefilli Mocha', price: 2500 },
        { ar: 'موه ميكس بيري', en: 'Mixed Berry Mocha', tr: 'Karışık Meyveli Mocha', price: 2500 },
        { ar: 'موه ليمون نعناع', en: 'Lemon Mint Mocha', tr: 'Limon Nane Mocha', price: 2500 },
        { ar: 'موه ليمون وردي', en: 'Pink Lemon Mocha', tr: 'Pembe Limon Mocha', price: 2500 },
        { ar: 'موه أناناس برتقال', en: 'Pineapple Orange Mocha', tr: 'Ananas Portakal Mocha', price: 2500 },
        { ar: 'موه خوخ برتقال', en: 'Peach Orange Mocha', tr: 'Şeftali Portakal Mocha', price: 2500 },
        { ar: 'موه باشن خوخ', en: 'Passion Peach Mocha', tr: 'Passion Şeftali Mocha', price: 2500 },
        { ar: 'موه باشن مانجو', en: 'Passion Mango Mocha', tr: 'Passion Mango Mocha', price: 2500 },
        { ar: 'موه باشن برتقال', en: 'Passion Orange Mocha', tr: 'Passion Portakal Mocha', price: 2500 },
        { ar: 'موه كاريبيان', en: 'Caribbean Mocha', tr: 'Karayip Mocha', price: 2500 },
        { ar: 'موه فراولة', en: 'Strawberry Mocha', tr: 'Çilekli Mocha', price: 2500 },
        { ar: 'موه فراولة نعناع', en: 'Strawberry Mint Mocha', tr: 'Çilek Nane Mocha', price: 2500 },
        { ar: 'موه فراولة مانجو', en: 'Strawberry Mango Mocha', tr: 'Çilek Mango Mocha', price: 2500 },
        { ar: 'ميلك شيك شوكولاتة', en: 'Chocolate Milkshake', tr: 'Çikolatalı Milkshake', price: 2200 },
        { ar: 'ميلك شيك فراولة', en: 'Strawberry Milkshake', tr: 'Çilekli Milkshake', price: 2200 },
        { ar: 'ميلك شيك فانيلا', en: 'Vanilla Milkshake', tr: 'Vanilyalı Milkshake', price: 2200 },
        { ar: 'ميلك شيك كراميل', en: 'Caramel Milkshake', tr: 'Karamelli Milkshake', price: 2200 },
        { ar: 'ميلك شيك لوتس', en: 'Lotus Milkshake', tr: 'Lotus Milkshake', price: 2200 },
        { ar: 'ميلك شيك أوريو', en: 'Oreo Milkshake', tr: 'Oreo Milkshake', price: 2200 },
        { ar: 'ميلك شيك كوكيز', en: 'Cookies Milkshake', tr: 'Kurabiyeli Milkshake', price: 2200 }
      ]
    },
    {
      slug: 'bubble-drinks',
      sortOrder: 4,
      translations: {
        ar: 'البابل درينكس',
        en: 'Bubble Drinks',
        tr: 'Bubble İçecekler'
      },
      items: [
        { ar: 'كوول لايم', en: 'Cool Lime', tr: 'Cool Lime', price: 1800 },
        { ar: 'كوول لايم + تفاح بابل', en: 'Cool Lime + Apple Bubble', tr: 'Cool Lime + Elma Bubble', price: 1800 },
        { ar: 'كوول لايم + فراولة بابل', en: 'Cool Lime + Strawberry Bubble', tr: 'Cool Lime + Çilek Bubble', price: 1800 },
        { ar: 'كوول لايم + بلوبيري بابل', en: 'Cool Lime + Blueberry Bubble', tr: 'Cool Lime + Yaban Mersini Bubble', price: 1800 },
        { ar: 'كركديه + تفاح بابل', en: 'Hibiscus + Apple Bubble', tr: 'Hibiscus + Elma Bubble', price: 1800 },
        { ar: 'كركديه + فراولة بابل', en: 'Hibiscus + Strawberry Bubble', tr: 'Hibiscus + Çilek Bubble', price: 1800 },
        { ar: 'كركديه + بلوبيري بابل', en: 'Hibiscus + Blueberry Bubble', tr: 'Hibiscus + Yaban Mersini Bubble', price: 1800 },
        { ar: 'فريش كوول لايم + مانجو', en: 'Fresh Cool Lime + Mango', tr: 'Taze Cool Lime + Mango', price: 1800 },
        { ar: 'فريش كوول لايم + فراولة', en: 'Fresh Cool Lime + Strawberry', tr: 'Taze Cool Lime + Çilek', price: 1800 },
        { ar: 'فريش كركديه + فراولة', en: 'Fresh Hibiscus + Strawberry', tr: 'Taze Hibiscus + Çilek', price: 1800 },
        { ar: 'فريش كركديه + بلوبيري', en: 'Fresh Hibiscus + Blueberry', tr: 'Taze Hibiscus + Yaban Mersini', price: 1800 },
        { ar: 'فراولة بابل + نعناع + ليموناضة', en: 'Strawberry Bubble + Mint + Lemonade', tr: 'Çilek Bubble + Nane + Limonata', price: 1800 },
        { ar: 'فراولة بابل + رمان + ليموناضة', en: 'Strawberry Bubble + Pomegranate + Lemonade', tr: 'Çilek Bubble + Nar + Limonata', price: 1800 },
        { ar: 'فراولة بابل + فراولة + ليموناضة', en: 'Strawberry Bubble + Strawberry + Lemonade', tr: 'Çilek Bubble + Çilek + Limonata', price: 1800 }
      ]
    },
    {
      slug: 'cold-drinks',
      sortOrder: 5,
      translations: {
        ar: 'المشروبات الباردة',
        en: 'Cold Drinks',
        tr: 'Soğuk İçecekler'
      },
      items: [
        { ar: 'آيس أمريكانو', en: 'Iced Americano', tr: 'Buzlu Americano', price: 2000 },
        { ar: 'آيس لاتيه', en: 'Iced Latte', tr: 'Buzlu Latte', price: 2000 },
        { ar: 'آيس كراميل لاتيه', en: 'Iced Caramel Latte', tr: 'Buzlu Karamel Latte', price: 2000 },
        { ar: 'آيس فانيليا لاتيه', en: 'Iced Vanilla Latte', tr: 'Buzlu Vanilyalı Latte', price: 2000 },
        { ar: 'آيس وايت شوكولاتة موكا', en: 'Iced White Chocolate Mocha', tr: 'Buzlu Beyaz Çikolatalı Mocha', price: 2000 },
        { ar: 'آيس سبانيش لاتيه', en: 'Iced Spanish Latte', tr: 'Buzlu İspanyol Latte', price: 2000 },
        { ar: 'آيس توفي نت لاتيه', en: 'Iced Toffee Nut Latte', tr: 'Buzlu Toffee Nut Latte', price: 2000 },
        { ar: 'آيس كراميل ماكياتو', en: 'Iced Caramel Macchiato', tr: 'Buzlu Karamel Macchiato', price: 2000 },
        { ar: 'آيس فيلتر كوفي', en: 'Iced Filter Coffee', tr: 'Buzlu Filtre Kahve', price: 2000 },
        { ar: 'كراميل بابل آيس لاتيه', en: 'Caramel Bubble Iced Latte', tr: 'Karamel Bubble Buzlu Latte', price: 2000 },
        { ar: 'كيراز تشيتشيك زين آيس لاتيه', en: 'Cherry Cheesecake Zen Iced Latte', tr: 'Kiraz Cheesecake Zen Buzlu Latte', price: 2000 },
        { ar: 'كوكونت زين آيس لاتيه', en: 'Coconut Zen Iced Latte', tr: 'Hindistan Cevizi Zen Buzlu Latte', price: 2000 },
        { ar: 'آيس تشاي تي لاتيه', en: 'Iced Chai Tea Latte', tr: 'Buzlu Chai Tea Latte', price: 2000 },
        { ar: 'آيس موكا', en: 'Iced Mocha', tr: 'Buzlu Mocha', price: 2000 },
        { ar: 'آيس زيبرا موكا', en: 'Iced Zebra Mocha', tr: 'Buzlu Zebra Mocha', price: 2000 },
        { ar: 'آيس فراولة موكا', en: 'Iced Strawberry Mocha', tr: 'Buzlu Çilekli Mocha', price: 2000 },
        { ar: 'آيس بترسكوتش', en: 'Iced Butter Scotch', tr: 'Buzlu Butter Scotch', price: 2000 },
        { ar: 'آيس بيكو لاتيه', en: 'Iced Piccolo Latte', tr: 'Buzlu Piccolo Latte', price: 2000 },
        { ar: 'آيس سولتد كراميل لاتيه', en: 'Iced Salted Caramel Latte', tr: 'Buzlu Tuzlu Karamel Latte', price: 2000 }
      ]
    },
    {
      slug: 'hot-drinks',
      sortOrder: 6,
      translations: {
        ar: 'المشروبات الساخنة',
        en: 'Hot Drinks',
        tr: 'Sıcak İçecekler'
      },
      items: [
        { ar: 'إسبريسو', en: 'Espresso', tr: 'Espresso', price: 1800 },
        { ar: 'إسبريسو ريستريتو', en: 'Espresso Ristretto', tr: 'Espresso Ristretto', price: 1800 },
        { ar: 'إسبريسو ماكياتو', en: 'Espresso Macchiato', tr: 'Espresso Macchiato', price: 1800 },
        { ar: 'إسبريسو أفوجاتو', en: 'Espresso Affogato', tr: 'Espresso Affogato', price: 1800 },
        { ar: 'كورتادو', en: 'Cortado', tr: 'Cortado', price: 1800 },
        { ar: 'فلات وايت', en: 'Flat White', tr: 'Flat White', price: 1800 },
        { ar: 'لاتيه', en: 'Latte', tr: 'Latte', price: 1800 },
        { ar: 'أمريكانو', en: 'Americano', tr: 'Americano', price: 1800 },
        { ar: 'كابتشينو', en: 'Cappuccino', tr: 'Cappuccino', price: 1800 },
        { ar: 'سبانيش لاتيه', en: 'Spanish Latte', tr: 'İspanyol Latte', price: 1800 },
        { ar: 'تشيز كيك لاتيه', en: 'Cheesecake Latte', tr: 'Cheesecake Latte', price: 1800 },
        { ar: 'بترسكوتش لاتيه', en: 'Butter Scotch Latte', tr: 'Butter Scotch Latte', price: 1800 },
        { ar: 'كراميل ماكياتو', en: 'Caramel Macchiato', tr: 'Karamel Macchiato', price: 1800 },
        { ar: 'كراميل لاتيه', en: 'Caramel Latte', tr: 'Karamel Latte', price: 1800 },
        { ar: 'فانيليا لاتيه', en: 'Vanilla Latte', tr: 'Vanilyalı Latte', price: 1800 },
        { ar: 'توفي نت لاتيه', en: 'Toffee Nut Latte', tr: 'Toffee Nut Latte', price: 1800 },
        { ar: 'شوكولاتة موكا', en: 'Chocolate Mocha', tr: 'Çikolatalı Mocha', price: 1800 },
        { ar: 'وايت شوكولاتة موكا', en: 'White Chocolate Mocha', tr: 'Beyaz Çikolatalı Mocha', price: 1800 },
        { ar: 'زيبرا موكا', en: 'Zebra Mocha', tr: 'Zebra Mocha', price: 1800 },
        { ar: 'بيكو موكا', en: 'Piccolo Mocha', tr: 'Piccolo Mocha', price: 1800 },
        { ar: 'فراولة موكا', en: 'Strawberry Mocha', tr: 'Çilekli Mocha', price: 1800 },
        { ar: 'تشاي تي لاتيه', en: 'Chai Tea Latte', tr: 'Chai Tea Latte', price: 1800 },
        { ar: 'هوت شوكولاتة', en: 'Hot Chocolate', tr: 'Sıcak Çikolata', price: 1600 },
        { ar: 'وايت هوت شوكولاتة', en: 'White Hot Chocolate', tr: 'Beyaz Sıcak Çikolata', price: 1600 }
      ]
    },
    {
      slug: 'traditional-drinks',
      sortOrder: 7,
      translations: {
        ar: 'المشروبات التقليدية',
        en: 'Traditional Drinks',
        tr: 'Geleneksel İçecekler'
      },
      items: [
        { ar: 'سحلب', en: 'Sahlab', tr: 'Sahlep', price: 1200 },
        { ar: 'شاي أعشاب', en: 'Herbal Tea', tr: 'Bitki Çayı', price: 1200 },
        { ar: 'قهوة تركية', en: 'Turkish Coffee', tr: 'Türk Kahvesi', price: 1200 },
        { ar: 'قهوة عربية', en: 'Arabic Coffee', tr: 'Arap Kahvesi', price: 1200 },
        { ar: 'شاي', en: 'Tea', tr: 'Çay', price: 1200 }
      ]
    }
  ]
}

async function addCompleteMenu() {
  log('🚀 Adding Complete Arabic Menu to Live Database', 'bright')
  
  try {
    for (const categoryData of menuData.categories) {
      log(`\n📂 Processing category: ${categoryData.translations.ar}`, 'magenta')
      
      // Check if category exists
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categoryData.slug)
        .single()
      
      let categoryId
      
      if (existingCategory) {
        logInfo(`Category ${categoryData.slug} already exists, updating...`)
        categoryId = existingCategory.id
        
        // Update category
        await supabase
          .from('categories')
          .update({
            sort_order: categoryData.sortOrder,
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', categoryId)
      } else {
        // Create new category
        const { data: newCategory, error: catError } = await supabase
          .from('categories')
          .insert({
            slug: categoryData.slug,
            sort_order: categoryData.sortOrder,
            is_active: true
          })
          .select()
          .single()
        
        if (catError) {
          logError(`Failed to create category: ${catError.message}`)
          continue
        }
        
        categoryId = newCategory.id
        logSuccess(`Created category: ${categoryData.slug}`)
      }
      
      // Update/create category translations
      for (const [locale, name] of Object.entries(categoryData.translations)) {
        await supabase
          .from('category_i18n')
          .upsert({
            category_id: categoryId,
            locale: locale,
            name: name
          }, { onConflict: 'category_id,locale' })
      }
      
      // Clear existing items for this category
      await supabase
        .from('items')
        .delete()
        .eq('category_id', categoryId)
      
      logInfo(`Adding ${categoryData.items.length} items...`)
      
      // Add items
      for (let i = 0; i < categoryData.items.length; i++) {
        const itemData = categoryData.items[i]
        
        // Create item
        const { data: item, error: itemError } = await supabase
          .from('items')
          .insert({
            category_id: categoryId,
            sort_order: i + 1,
            is_active: true
          })
          .select()
          .single()
        
        if (itemError) {
          logError(`Failed to create item: ${itemError.message}`)
          continue
        }
        
        // Add translations
        const translations = [
          { item_id: item.id, locale: 'ar', name: itemData.ar, description: null },
          { item_id: item.id, locale: 'en', name: itemData.en, description: null },
          { item_id: item.id, locale: 'tr', name: itemData.tr, description: null }
        ]
        
        const { error: transError } = await supabase
          .from('item_i18n')
          .insert(translations)
        
        if (transError) {
          logError(`Failed to create translations: ${transError.message}`)
          continue
        }
        
        // Add price
        const { error: priceError } = await supabase
          .from('item_prices')
          .insert({
            item_id: item.id,
            size_name: 'Regular',
            price_cents: itemData.price,
            sort_order: 0,
            is_active: true
          })
        
        if (priceError) {
          logError(`Failed to create price: ${priceError.message}`)
          continue
        }
        
        logInfo(`  ✅ ${itemData.ar}`)
      }
      
      logSuccess(`Successfully added ${categoryData.items.length} items to "${categoryData.translations.ar}"`)
    }
    
    log('\n🎉 Complete menu added successfully!', 'bright')
    logInfo('Your website now has the full Arabic menu with 100+ items!')
    logInfo('Visit https://piko-digital-menu-diui.vercel.app/ to see the updated menu')
    
  } catch (error) {
    logError(`Failed to add menu: ${error.message}`)
    process.exit(1)
  }
}

// Run the script
addCompleteMenu().catch(err => {
  logError(`Unexpected error: ${err.message}`)
  process.exit(1)
})
