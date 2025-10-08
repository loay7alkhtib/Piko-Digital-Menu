// Simple database connection test
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eoaissoqwlfvfizfomax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWlzc29xd2xmdmZpemZvbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTY5OTIsImV4cCI6MjA3NTMzMjk5Mn0.SHkFV9EvSnWVmC0tApVU6A6C1rrDqsPMO922rMC1JpY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Database Error:', error)
    } else {
      console.log('✅ Database connected successfully!')
      console.log('Categories found:', data?.length || 0)
    }
  } catch (err) {
    console.log('❌ Connection Error:', err.message)
  }
}

testConnection()
