import { createClient } from "@supabase/supabase-js";
const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
