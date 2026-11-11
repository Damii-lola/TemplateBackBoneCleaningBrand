/**
 * ============================================================
 * BRAND + SUPABASE CONFIG
 * ============================================================
 *
 * ⚠️ WHEN INTEGRATING A REAL BRAND — CHANGE EVERYTHING MARKED:
 *    [CHANGE ME] or [Brand Name] or YOUR_...
 *
 * This one file controls:
 *  - Which brand this site belongs to (for multi-brand Supabase)
 *  - Admin login
 *  - Supabase connection
 *  - Where booking emails go
 * ============================================================
 */

window.BRAND_CONFIG = {
  // ---------- BRAND IDENTITY (multi-brand Supabase) ----------
  // [CHANGE ME] Unique slug for this brand (lowercase, no spaces)
  // Used to filter bookings so Brand A never sees Brand B's data
  brandId: 'demo-cleaning-brand',

  // [CHANGE ME] Display name
  brandName: '[Brand Name]',

  // [CHANGE ME] Brand type — for now only 'Cleaning'
  // Later templates: 'Landscaping', 'Plumbing', etc.
  brandType: 'Cleaning',

  // [CHANGE ME] Email that receives new booking alerts
  brandEmail: 'YOUR_BRAND_EMAIL@gmail.com',

  // ---------- ADMIN LOGIN (client-side gate) ----------
  // [CHANGE ME] Username shown on admin login
  adminUsername: '[Brand Name]',

  // [CHANGE ME] Admin password — set a strong one per client
  adminPassword: 'change-this-password',

  // ---------- SUPABASE ----------
  // From Supabase → Project Settings → API Keys
  // [CHANGE ME] only when using a different Supabase project
  supabaseUrl: 'https://eycsnympklwoddsnjoxy.supabase.co',
  // Publishable key only (sb_publishable_...) — NEVER the secret key here
  supabasePublishableKey: 'sb_publishable_Mo9mXneD77gahYzzJOp0Ng_wik7Eas_',

  // Edge Function URL for sending emails (set after deploying the function)
  // Example: https://eycsnympklwoddsnjoxy.supabase.co/functions/v1/send-booking-emails
  // [CHANGE ME] after you deploy supabase/functions/send-booking-emails
  emailFunctionUrl: 'https://eycsnympklwoddsnjoxy.supabase.co/functions/v1/send-booking-emails'
};

// Backwards-compatible aliases used by booking.js / admin.js
window.SUPABASE_URL = window.BRAND_CONFIG.supabaseUrl;
window.SUPABASE_PUBLISHABLE_KEY = window.BRAND_CONFIG.supabasePublishableKey;
