#!/usr/bin/env node

/**
 * Backend Testing Script for Piko Digital Menu
 * Tests database connection, queries, and functionality
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(60))
  log(title, 'cyan')
  console.log('='.repeat(60))
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// Test functions
async function testConnection() {
  logSection('Testing Supabase Connection')
  
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

async function testTables() {
  logSection('Testing Database Tables')
  
  const tables = ['categories', 'category_i18n', 'items', 'item_i18n', 'item_prices', 'profiles']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        logError(`Table ${table}: ${error.message}`)
      } else {
        logSuccess(`Table ${table}: OK`)
      }
    } catch (err) {
      logError(`Table ${table}: ${err.message}`)
    }
  }
}

async function testCategories() {
  logSection('Testing Categories Query')
  
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
      logWarning('No categories found')
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
  logSection('Testing Items Query')
  
  try {
    // Get first category
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
      .eq('is_active', true)
      .limit(1)
    
    if (!categories || categories.length === 0) {
      logWarning('No categories found for items test')
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
      logWarning(`No items found for category: ${categorySlug}`)
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
  logSection('Testing Storage Bucket')
  
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

async function testAuthentication() {
  logSection('Testing Authentication')
  
  try {
    // Test anonymous access
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      logWarning(`Auth check: ${error.message}`)
    } else {
      logInfo(`Current user: ${data.user ? data.user.id : 'Anonymous'}`)
    }
    
    logSuccess('Authentication system is accessible')
    
  } catch (err) {
    logError(`Auth test error: ${err.message}`)
  }
}

async function generateSampleStaffUser() {
  logSection('Generating Sample Staff User Query')
  
  const sampleEmail = 'staff@pikomenu.com'
  const samplePassword = 'SecurePassword123!'
  
  logInfo('To create a staff user, run this in Supabase SQL Editor:')
  console.log(`
-- 1. First, create a user in Authentication → Users
-- 2. Then run this query with the user's ID:
INSERT INTO profiles (id, email, role) 
VALUES ('USER_ID_FROM_AUTH', '${sampleEmail}', 'staff');
  `)
  
  logInfo('Or use this Supabase Auth signup in your app:')
  console.log(`
const { data, error } = await supabase.auth.signUp({
  email: '${sampleEmail}',
  password: '${samplePassword}',
  options: {
    data: { role: 'staff' }
  }
});
  `)
}

async function runAllTests() {
  log('🚀 Starting Piko Digital Menu Backend Tests', 'bright')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    logError('Cannot proceed without database connection')
    process.exit(1)
  }
  
  await testTables()
  await testCategories()
  await testItems()
  await testStorage()
  await testAuthentication()
  await generateSampleStaffUser()
  
  logSection('Test Summary')
  logSuccess('Backend testing completed!')
  logInfo('If all tests passed, your backend is ready for production.')
  logWarning('Remember to create staff users through Supabase Auth.')
}

// Run tests
if (require.main === module) {
  runAllTests().catch(err => {
    logError(`Test runner error: ${err.message}`)
    process.exit(1)
  })
}

module.exports = {
  testConnection,
  testTables,
  testCategories,
  testItems,
  testStorage,
  testAuthentication,
  runAllTests
}
