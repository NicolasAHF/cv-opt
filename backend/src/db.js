import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL y Key deben estar definidos en el archivo .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
