import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
	auth: { persistSession: false },
});


