import { createClient } from '@supabase/supabase-js'

// prendo le variabili dal file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// creo il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)