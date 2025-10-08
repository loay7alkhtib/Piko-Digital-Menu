#!/usr/bin/env node

/**
 * Test Database Connection for Live Website
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing database connection for live website...')
  
  try {
    // Test the exact query used by the website
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
      console.error('❌ Database query failed:', error)
      return
    }

    console.log('✅ Database query successful!')
    console.log(`📊 Found ${data?.length || 0} categories:`)
    
    if (data) {
      data.forEach(cat => {
        const name = cat.category_i18n?.[0]?.name || cat.slug
        console.log(`   - ${cat.slug} (${name})`)
      })
    }

    // Test items query
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select(`
        *,
        item_i18n(name),
        item_prices(price_cents, is_active),
        categories(slug)
      `)
      .eq('categories.slug', 'desserts')
      .eq('is_active', true)
      .eq('item_i18n.locale', 'en')
      .order('sort_order')

    if (itemsError) {
      console.error('❌ Items query failed:', itemsError)
      return
    }

    console.log(`🍰 Found ${itemsData?.length || 0} dessert items:`)
    if (itemsData) {
      itemsData.slice(0, 5).forEach(item => {
        const name = item.item_i18n?.[0]?.name || 'Untitled'
        const activePrices = item.item_prices?.filter(p => p.is_active) || []
        const minPrice = activePrices.length > 0 ? Math.min(...activePrices.map(p => p.price_cents)) : 0
        console.log(`   - ${name} (${minPrice} cents)`)
      })
      if (itemsData.length > 5) {
        console.log(`   ... and ${itemsData.length - 5} more items`)
      }
    }

    console.log('\n🎉 Database is working correctly!')
    console.log('💡 The issue might be Vercel caching. Try:')
    console.log('   1. Wait 2-3 minutes for Vercel to redeploy')
    console.log('   2. Clear browser cache (Ctrl+F5)')
    console.log('   3. Try incognito mode')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testConnection()
