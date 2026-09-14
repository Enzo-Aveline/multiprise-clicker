import { createClient } from '@supabase/supabase-js'

// Les variables d'environnement doivent être définies dans Vercel (.env)
// Par défaut on laisse vide s'il n'y en a pas pour éviter de crash l'app localement 
// avant configuration.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
