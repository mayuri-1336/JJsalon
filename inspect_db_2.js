import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wgbeqmelhsunntumbxee.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmVxbWVsaHN1bm50dW1ieGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzMxODUsImV4cCI6MjA4NjMwOTE4NX0.DNVSSal5mWn4PF_81xJD7eC-SGgbeZhHr1FQkuCG6kw'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function test() {
  const { data: trx, error: errTrx } = await supabase.from('transformations').select('*').limit(1)
  console.log("Transformations columns:", trx && trx.length > 0 ? Object.keys(trx[0]) : "No data", errTrx)
  
  const { data: aps, error: errAps } = await supabase.from('appointments').select('*').limit(1)
  console.log("Appointments columns:", aps && aps.length > 0 ? Object.keys(aps[0]) : "No data", errAps)
}
test()
