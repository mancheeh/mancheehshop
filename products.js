/*
=======================================================
  PRODUCTS DATA — mancheeh.shop
  ───────────────────────────────────────────────────
  This file is now just an EMPTY FALLBACK. Your real products
  live in your Supabase database and are managed entirely
  through admin.html.

  This array only gets used if the site can't reach the
  database for some reason (e.g. supabase-config.js isn't
  set up, or there's a connection issue) — so the site never
  crashes, it just shows nothing until the database is
  reachable again.

  You don't need to edit this file. Add, edit, and delete
  products through admin.html instead.
=======================================================
*/

function getProductImagePath(store, category, filename) {
  return `image/${store}/${category}/${encodeURIComponent(filename)}`;
}

const PRODUCTS = [];
