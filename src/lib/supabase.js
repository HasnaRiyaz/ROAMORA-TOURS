import { createClient } from '@supabase/supabase-js'

console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL)
console.log(
  'SUPABASE KEY EXISTS:',
  !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)