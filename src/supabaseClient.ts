import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://jqyappszynnlzzgpjvna.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeWFwcHN6eW5ubHp6Z3Bqdm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDEwMjgsImV4cCI6MjA1NTIxNzAyOH0.e_87_kalRjcYy_V8swo5eFuYs2v8hJQnS2zXPGMDTGs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)