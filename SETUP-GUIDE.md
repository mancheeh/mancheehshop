# mancheeh.shop — Admin Dashboard Setup Guide (Supabase)

Your products now live in a real database (Supabase, built on Postgres)
with photo storage built in. You get:

- **admin.html** — password-protected dashboard: add / edit / delete products
- **Upload photos straight from your device** — no more pasting image links
- Changes save instantly and your **storefront (index.html) updates live**,
  no re-upload needed
- **Dark mode** on both the admin panel and the shop
- Free on Supabase's free tier for a store this size
- Locked down so only *your* account can ever log in or make changes

---

## 1. Create your Supabase project

1. Go to **supabase.com** → **Start your project** → sign up → **New project**.
2. Give it a name (e.g. `mancheeh-shop`), set a database password (save it
   somewhere — you likely won't need it again, but keep it safe), pick a
   region close to your customers → **Create new project** (takes ~2 min).

## 2. Create the database table + storage bucket

1. In the left sidebar: **SQL Editor** → **New query**.
2. Open **supabase-schema.sql** (included here) → copy the whole file →
   paste it into the SQL editor.
3. **Don't run it yet** — first find-and-replace the two spots that say
   `YOUR_ADMIN_UID` (you'll fill in the real value in step 4). For now you
   can run it as-is with the placeholder; you'll update it in step 4.
4. Click **Run**. This creates the `products` table and the
   `product-images` storage bucket, with security rules already in place.

## 3. Create your admin login

1. Left sidebar → **Authentication → Users** → **Add user** → **Create new user**.
2. Enter the email and password *you* want to log into `admin.html` with →
   check **"Auto Confirm User"** → **Create user**.
3. Click on the user you just created → copy the **UID** shown at the top
   (a long string like `3fa2b1c4-...`).

## 4. Lock the database to your account only

1. Left sidebar → **SQL Editor → New query**, paste and run this (replacing
   the UID with the one you just copied):
   ```sql
   -- run this once to fix the policies with your real UID
   drop policy "Only admin can insert products" on public.products;
   drop policy "Only admin can update products" on public.products;
   drop policy "Only admin can delete products" on public.products;
   drop policy "Only admin can upload product images" on storage.objects;
   drop policy "Only admin can update product images" on storage.objects;
   drop policy "Only admin can delete product images" on storage.objects;

   create policy "Only admin can insert products" on public.products for insert with check (auth.uid()::text = 'PASTE_YOUR_UID_HERE');
   create policy "Only admin can update products" on public.products for update using (auth.uid()::text = 'PASTE_YOUR_UID_HERE');
   create policy "Only admin can delete products" on public.products for delete using (auth.uid()::text = 'PASTE_YOUR_UID_HERE');
   create policy "Only admin can upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.uid()::text = 'PASTE_YOUR_UID_HERE');
   create policy "Only admin can update product images" on storage.objects for update using (bucket_id = 'product-images' and auth.uid()::text = 'PASTE_YOUR_UID_HERE');
   create policy "Only admin can delete product images" on storage.objects for delete using (bucket_id = 'product-images' and auth.uid()::text = 'PASTE_YOUR_UID_HERE');
   ```
2. Now only your specific account can add/edit/delete — everyone else can
   still just *view* the shop, which is what you want.

## 5. Connect the site to your project

1. In Supabase: **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open **supabase-config.js** in this folder → paste your real values in,
   replacing the `SUPABASE_URL` and `SUPABASE_ANON_KEY` placeholders.

## 6. Move your existing products into the database (one time only)

1. Upload all these files to your web host (GitHub/Vercel), in the same
   folder, exactly as named: `index.html`, `style.css`, `main.js`,
   `products.js`, `supabase-config.js`, `products-service.js`,
   `admin.html`, `admin.css`, `admin.js`, `migrate.html`, `robots.txt`.
2. Visit `yourdomain.com/migrate.html`.
3. Click **"Migrate products.js → Supabase"**. This copies your current
   33 products into the database, once.
4. Once it says "Done!", **delete migrate.html** from your GitHub repo
   (its job is finished, and you don't want it uploading duplicates by
   accident).

## 7. Start managing your store

Visit `yourdomain.com/admin.html`, sign in with the email/password from
step 3, and you can:

- **Add product** → fill in the name, price, store, category, etc.
- **Upload a photo** — click "Product photo", pick an image from your
  phone/computer. It uploads automatically and fills in the image field —
  you'll see a live preview and an "Uploaded ✓" confirmation.
- **Edit** — click the pencil icon on any row.
- **Delete** — click Delete, confirm.
- Toggle **dark mode** with the moon/sun icon.

Every change appears on your live storefront within a second or two.

---

## Notes

- **Offline fallback**: if `supabase-config.js` isn't filled in yet, the
  storefront still works using the old `products.js` data, so your site
  never breaks while you're setting things up.
- **Cost**: Supabase's free tier includes 500MB database, 1GB file storage,
  and 5GB bandwidth/month — far more than a store this size needs.
- **Photo size**: for fast page loads, resize images to roughly 800×800px
  before uploading if your phone photos are very large (most phone camera
  apps have a "compress/resize" export option).
- **More than one admin?** Repeat step 3 (Authentication → Users → Add
  user) for each person, then add their UID to the same policies in step 4.
