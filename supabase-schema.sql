-- =====================================================
-- supabase-schema.sql
-- Run this once in: Supabase project → SQL Editor → New query → Run
-- =====================================================

-- 1. Create the products table
create table if not exists public.products (
  id           bigint generated always as identity primary key,
  name         text not null,
  description  text,
  price        text,
  category     text,
  store        text,
  img          text,
  images       jsonb default '[]'::jsonb,
  affiliate_url text,
  features     jsonb default '[]'::jsonb,
  created_at   timestamptz default now()
);

-- If your table already exists (you already ran this file before), this
-- line safely adds the new "images" column without touching your data:
alter table public.products add column if not exists images jsonb default '[]'::jsonb;

-- 2. Turn on Row Level Security (RLS) — required so your data isn't wide open
alter table public.products enable row level security;

-- 3. Anyone can VIEW products (needed for your public storefront)
create policy "Public can read products"
  on public.products for select
  using (true);

-- 4. Only YOUR signed-in admin account can add/edit/delete.
--    Replace YOUR_ADMIN_UID with your Supabase Auth user id — find it at:
--    Authentication → Users → click your email → copy the "UID" field.
create policy "Only admin can insert products"
  on public.products for insert
  with check (auth.uid()::text = 'YOUR_ADMIN_UID');

create policy "Only admin can update products"
  on public.products for update
  using (auth.uid()::text = 'YOUR_ADMIN_UID');

create policy "Only admin can delete products"
  on public.products for delete
  using (auth.uid()::text = 'YOUR_ADMIN_UID');

-- =====================================================
-- 5. Storage bucket for product photos
--    (Run this part too — same SQL editor)
-- =====================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can view photos (so they show up on your public site)
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only your admin account can upload/replace/delete photos
create policy "Only admin can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.uid()::text = 'YOUR_ADMIN_UID');

create policy "Only admin can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.uid()::text = 'YOUR_ADMIN_UID');

create policy "Only admin can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.uid()::text = 'YOUR_ADMIN_UID');
