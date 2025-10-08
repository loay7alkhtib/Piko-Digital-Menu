#!/usr/bin/env node

/**
 * Debug Home Page Data Fetching
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugHomePage() {
  console.log('🔍 Debugging Home Page Data Fetching...')
  
  try {
    // Test the exact query from lib/queries.ts
    console.log('📊 Testing getActiveCategories query...')
    
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
      console.error('❌ Query failed:', error)
      return
    }

    console.log('✅ Query successful!')
    console.log(`📈 Found ${data?.length || 0} categories`)
    
    if (data && data.length > 0) {
      console.log('\n📋 Categories from database:')
      data.forEach((cat, index) => {
        const name = cat.category_i18n?.[0]?.name || cat.slug
        console.log(`   ${index + 1}. ${cat.slug} -> "${name}"`)
      })
    } else {
      console.log('❌ No categories found in database!')
    }

    // Check if there are any categories at all
    const { data: allCategories, error: allError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')

    if (allError) {
      console.error('❌ All categories query failed:', allError)
    } else {
      console.log(`\n📊 Total categories in database: ${allCategories?.length || 0}`)
      if (allCategories) {
        allCategories.forEach(cat => {
          console.log(`   - ${cat.slug} (active: ${cat.is_active})`)
        })
      }
    }

    // Check category translations
    const { data: translations, error: transError } = await supabase
      .from('category_i18n')
      .select('*')
      .eq('locale', 'en')

    if (transError) {
      console.error('❌ Translations query failed:', transError)
    } else {
      console.log(`\n🌍 English translations: ${translations?.length || 0}`)
      if (translations) {
        translations.forEach(trans => {
          console.log(`   - Category ${trans.category_id}: "${trans.name}"`)
        })
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

debugHomePage()
