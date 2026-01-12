
import { createClient } from '@supabase/supabase-js';

// Datos de conexión proporcionados
const supabaseUrl = 'https://yyiuwavyvgxlsrgihbkr.supabase.co';
const supabaseAnonKey = 'sb_publishable_cgMlbrJmU_39KEVDPghKbA_WTSbEJon';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
