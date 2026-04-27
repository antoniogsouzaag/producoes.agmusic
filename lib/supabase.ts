import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.warn('SUPABASE_URL not configured.')
}
if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not configured.')
}

// Client com service role — usado apenas no servidor (API routes)
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'agmusic'
}
