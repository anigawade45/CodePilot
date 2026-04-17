import { createClient } from '@supabase/supabase-js';

// 🏛️ SUPABASE SINGLETON
// Ensures only one connection instance exists across the entire React lifecycle.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
