import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czvcaviicssfrwlchtrw.supabase.co';
const supabaseAnonKey = 'sb_publishable_r8Ox32Y5dljzLHQxXC2Afw_BiX5sEzq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});