import { createClient } from "@supabase/supabase-js";
import { env } from "./env.config";

const supabaseUrl = "https://snwcxnedrguxdlkisnkp.supabase.co";
const supabaseKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_KEY is not set");
}

export const supabaseServiceClient = createClient(supabaseUrl, supabaseKey);
