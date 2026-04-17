import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wgbeqmelhsunntumbxee.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmVxbWVsaHN1bm50dW1ieGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzMxODUsImV4cCI6MjA4NjMwOTE4NX0.DNVSSal5mWn4PF_81xJD7eC-SGgbeZhHr1FQkuCG6kw'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function test() {
  const { data, error } = await supabase.from('gallery_items').select('*').limit(1)
  console.log("Gallery Items columns:", data && data.length > 0 ? Object.keys(data[0]) : "No data to infer columns")
  
  // Try inserting with a dummy column to see error
  const res = await supabase.from('gallery_items').insert({
    title: 'test',
    description: 'test',
    file_url: 'test',
    file_type: 'test',
    category: 'test'
  }).select()
  console.log("Insert with category result:", res)
}
test()
