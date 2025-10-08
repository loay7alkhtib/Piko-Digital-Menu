// Test the fixed query
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFixedQuery() {
  console.log('Testing fixed query...')
  
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
      console.log('❌ Query Error:', error)
    } else {
      console.log('✅ Query successful!')
      console.log('Categories found:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('First category:', {
          slug: data[0].slug,
          name: data[0].category_i18n?.[0]?.name || 'No name'
        })
      }
    }
  } catch (err) {
    console.log('❌ Error:', err.message)
  }
}

testFixedQuery()
