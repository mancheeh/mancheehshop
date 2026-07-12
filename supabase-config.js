/* =====================================================
   supabase-config.js
   ─────────────────────────────────────────────────────
   1. Go to https://supabase.com → New project (free tier)
   2. In the project: Settings (gear icon) → API
      → copy "Project URL" and the "anon public" key
   3. Paste them below, replacing the placeholders.
   Full walkthrough: see SETUP-GUIDE.md
   ===================================================== */

const SUPABASE_URL = "https://jalldtzmffhdqrdulqko.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gCbC9YlzVzLbOjObbQEfkg_NQI_htDW";

// A quick check so the site fails gracefully (falls back to products.js)
// instead of breaking, if you haven't set this up yet.
const SUPABASE_CONFIGURED = SUPABASE_URL.indexOf("YOUR_PROJECT_ID") === -1;

let supabaseClient = null;

if (SUPABASE_CONFIGURED) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
