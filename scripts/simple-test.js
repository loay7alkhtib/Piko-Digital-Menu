#!/usr/bin/env node

/**
 * Simple Backend Test for Piko Digital Menu
 * Tests basic database connectivity and queries
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration (using your existing credentials)
const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
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

// Test functions
async function testConnection() {
  log('\n🔌 Testing Supabase Connection', 'cyan')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (error) {
      logError(`Connection failed: ${error.message}`)
      return false
    }
    
    logSuccess('Supabase connection successful')
    return true
  } catch (err) {
    logError(`Connection error: ${err.message}`)
    return false
  }
}

async function testCategories() {
  log('\n📂 Testing Categories Query', 'cyan')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        category_i18n(name)
      `)
      .eq('is_active', true)
      .eq('category_i18n.locale', 'en')
      .order('sort_order')
    
    if (error) {
      logError(`Categories query failed: ${error.message}`)
      return
    }
    
    if (!data || data.length === 0) {
      logError('No categories found - database may not be set up')
      return
    }
    
    logSuccess(`Found ${data.length} categories:`)
    data.forEach(cat => {
      const name = cat.category_i18n?.[0]?.name || cat.slug
      logInfo(`  - ${cat.slug} (${name})`)
    })
    
  } catch (err) {
    logError(`Categories test error: ${err.message}`)
  }
}

async function testItems() {
  log('\n🍽️  Testing Items Query', 'cyan')
  
  try {
    // Get first category
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
      .eq('is_active', true)
      .limit(1)
    
    if (!categories || categories.length === 0) {
      logError('No categories found for items test')
      return
    }
    
    const categorySlug = categories[0].slug
    
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        item_i18n(name, description),
        item_prices(price_cents, is_active),
        categories(slug)
      `)
      .eq('categories.slug', categorySlug)
      .eq('is_active', true)
      .eq('item_i18n.locale', 'en')
      .order('sort_order')
    
    if (error) {
      logError(`Items query failed: ${error.message}`)
      return
    }
    
    if (!data || data.length === 0) {
      logError(`No items found for category: ${categorySlug}`)
      return
    }
    
    logSuccess(`Found ${data.length} items in category "${categorySlug}":`)
    data.forEach(item => {
      const name = item.item_i18n?.[0]?.name || 'Untitled'
      const activePrices = item.item_prices?.filter(p => p.is_active) || []
      const minPrice = activePrices.length > 0 
        ? Math.min(...activePrices.map(p => p.price_cents))
        : 0
      
      logInfo(`  - ${name} (${minPrice} cents)`)
    })
    
  } catch (err) {
    logError(`Items test error: ${err.message}`)
  }
}

async function testStorage() {
  log('\n📁 Testing Storage Bucket', 'cyan')
  
  try {
    const { data, error } = await supabase
      .storage
      .from('menu-images')
      .list('', { limit: 1 })
    
    if (error) {
      logError(`Storage test failed: ${error.message}`)
      return
    }
    
    logSuccess('Storage bucket "menu-images" is accessible')
    logInfo(`Found ${data?.length || 0} files in bucket`)
    
  } catch (err) {
    logError(`Storage test error: ${err.message}`)
  }
}

async function runAllTests() {
  log('🚀 Starting Piko Digital Menu Backend Tests', 'bright')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    logError('Cannot proceed without database connection')
    process.exit(1)
  }
  
  await testCategories()
  await testItems()
  await testStorage()
  
  log('\n🎉 Backend testing completed!', 'cyan')
  logInfo('If all tests passed, your backend is ready for production.')
  logInfo('Remember to create staff users through Supabase Auth.')
}

// Run tests
runAllTests().catch(err => {
  logError(`Test runner error: ${err.message}`)
  process.exit(1)
})
