/**
 * Supabase configuration
 *
 * 1. Create a project at https://supabase.com
 * 2. Go to Project Settings → API Keys
 * 3. Copy Project URL and Publishable key into the values below
 *
 * Use the Publishable key (sb_publishable_...) in the browser.
 * Never put the Secret key (sb_secret_...) in frontend code.
 *
 * Legacy note: Publishable key = old "anon" key
 *              Secret key      = old "service_role" key
 */

window.SUPABASE_URL = 'YOUR_SUPABASE_URL';
window.SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY';

/**
 * Example:
 * window.SUPABASE_URL = 'https://abcdefgh.supabase.co';
 * window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_...';
 */