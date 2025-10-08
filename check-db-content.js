// Check what's actually in the database
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('Checking database content...\n')
  
  // Check categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
  
  console.log('Categories:', catError ? `Error: ${catError.message}` : categories)
  
  // Check category_i18n
  const { data: categoryI18n, error: i18nError } = await supabase
    .from('category_i18n')
    .select('*')
  
  console.log('\nCategory i18n:', i18nError ? `Error: ${i18nError.message}` : categoryI18n)
  
  // Check items
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
  
  console.log('\nItems:', itemsError ? `Error: ${itemsError.message}` : items)
  
  // Check profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
  
  console.log('\nProfiles:', profilesError ? `Error: ${profilesError.message}` : profiles)
}

checkDatabase()
