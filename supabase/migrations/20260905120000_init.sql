-- ATELIER initial schema, triggers, RLS, storage, and checkout RPC.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('customer', 'admin');
create type public.product_status as enum ('draft', 'published', 'archived');
create type public.order_status as enum ('pending', 'confirmed', 'fulfilled', 'cancelled');
create type public.payment_status as enum ('unpaid', 'paid', 'failed', 'refunded');
create type public.fulfillment_status as enum ('unfulfilled', 'partial', 'fulfilled');
create type public.address_type as enum ('shipping', 'billing');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text not null default '',
  material text,
  care_instructions text,
  status public.product_status not null default 'draft',
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  color_hex text,
  price_cents integer not null check (price_cents >= 0),
  compare_at_cents integer check (compare_at_cents is null or compare_at_cents >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.address_type not null,
  label text,
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, variant_id)
);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  fulfillment_status public.fulfillment_status not null default 'unfulfilled',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'usd',
  shipping_address jsonb not null,
  billing_address jsonb not null,
  notes text,
  payment_intent_id text,
  placed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  sku text not null,
  size text not null,
  color text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  image_path text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index products_category_id_idx on public.products (category_id);
create index products_status_published_idx on public.products (status) where status = 'published';
create index products_featured_idx on public.products (is_featured) where is_featured;
create index product_variants_product_id_idx on public.product_variants (product_id);
create index product_images_product_id_idx on public.product_images (product_id);
create index cart_items_user_id_idx on public.cart_items (user_id);
create index wishlists_user_id_idx on public.wishlists (user_id);
create index orders_user_id_idx on public.orders (user_id);
create index orders_email_idx on public.orders (email);
create index orders_placed_at_idx on public.orders (placed_at desc);
create index order_items_order_id_idx on public.order_items (order_id);
create unique index addresses_one_default_per_type
  on public.addresses (user_id, type)
  where is_default;

-- ---------------------------------------------------------------------------
-- Shared triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth: profile + JWT claim
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.sync_user_role_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('user_role', new.role::text)
  where id = new.id;
  return new;
end;
$$;

create trigger profiles_sync_role_claim
  after insert or update of role on public.profiles
  for each row execute function public.sync_user_role_claim();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Role cannot be changed by non-admin users';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- ---------------------------------------------------------------------------
-- Order numbering + checkout RPC
-- ---------------------------------------------------------------------------

create sequence public.order_number_seq;

create or replace function public.next_order_number()
returns text
language sql
as $$
  select 'ATL-'
    || to_char(timezone('utc', now()), 'YYYY')
    || '-'
    || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

create or replace function public.create_order(
  p_email text,
  p_shipping_address jsonb,
  p_billing_address jsonb,
  p_items jsonb,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_user_id uuid := auth.uid();
  v_subtotal integer := 0;
  v_item jsonb;
  v_qty integer;
  v_variant_id uuid;
  v_variant public.product_variants%rowtype;
  v_seen uuid[] := '{}';
begin
  if p_email is null or position('@' in trim(p_email)) = 0 then
    raise exception 'A valid email is required';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  if p_shipping_address is null
     or coalesce(p_shipping_address->>'full_name', '') = ''
     or coalesce(p_shipping_address->>'line1', '') = ''
     or coalesce(p_shipping_address->>'city', '') = ''
     or coalesce(p_shipping_address->>'region', '') = ''
     or coalesce(p_shipping_address->>'postal_code', '') = ''
     or coalesce(p_shipping_address->>'country', '') = '' then
    raise exception 'Shipping address is incomplete';
  end if;

  if p_billing_address is null
     or coalesce(p_billing_address->>'full_name', '') = ''
     or coalesce(p_billing_address->>'line1', '') = ''
     or coalesce(p_billing_address->>'city', '') = ''
     or coalesce(p_billing_address->>'region', '') = ''
     or coalesce(p_billing_address->>'postal_code', '') = ''
     or coalesce(p_billing_address->>'country', '') = '' then
    raise exception 'Billing address is incomplete';
  end if;

  for v_item in select value from jsonb_array_elements(p_items) as t(value)
  loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    if v_variant_id is null or v_qty is null or v_qty <= 0 then
      raise exception 'Each item requires a variant_id and a positive quantity';
    end if;

    if v_variant_id = any (v_seen) then
      raise exception 'Duplicate variant in order payload';
    end if;
    v_seen := array_append(v_seen, v_variant_id);

    select *
    into v_variant
    from public.product_variants
    where id = v_variant_id
    for update;

    if not found then
      raise exception 'Variant not found';
    end if;

    if not v_variant.is_active then
      raise exception 'Variant is not available';
    end if;

    if not exists (
      select 1
      from public.products p
      where p.id = v_variant.product_id
        and p.status = 'published'
    ) then
      raise exception 'Product is not available';
    end if;

    if v_variant.stock < v_qty then
      raise exception 'Insufficient stock for SKU %', v_variant.sku;
    end if;

    v_subtotal := v_subtotal + (v_variant.price_cents * v_qty);
  end loop;

  insert into public.orders (
    order_number,
    user_id,
    email,
    status,
    payment_status,
    fulfillment_status,
    subtotal_cents,
    shipping_cents,
    tax_cents,
    total_cents,
    shipping_address,
    billing_address,
    notes
  )
  values (
    public.next_order_number(),
    v_user_id,
    lower(trim(p_email)),
    'pending',
    'unpaid',
    'unfulfilled',
    v_subtotal,
    0,
    0,
    v_subtotal,
    p_shipping_address,
    p_billing_address,
    p_notes
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items) as t(value)
  loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    update public.product_variants
    set stock = stock - v_qty
    where id = v_variant_id
    returning * into v_variant;

    insert into public.order_items (
      order_id,
      variant_id,
      product_name,
      sku,
      size,
      color,
      unit_price_cents,
      quantity,
      image_path
    )
    select
      v_order_id,
      v_variant.id,
      p.name,
      v_variant.sku,
      v_variant.size,
      v_variant.color,
      v_variant.price_cents,
      v_qty,
      coalesce(
        v_variant.image_path,
        (
          select pi.storage_path
          from public.product_images pi
          where pi.product_id = p.id
          order by pi.is_primary desc, pi.sort_order asc
          limit 1
        )
      )
    from public.products p
    where p.id = v_variant.product_id;
  end loop;

  if v_user_id is not null then
    delete from public.cart_items
    where user_id = v_user_id
      and variant_id = any (v_seen);
  end if;

  return v_order_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants (RLS still applies)
-- ---------------------------------------------------------------------------

revoke all on schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;

grant select on public.categories, public.products, public.product_images, public.product_variants
  to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select, insert, update, delete on public.wishlists to authenticated;

grant select, insert, update on public.orders to authenticated;
grant select on public.orders to anon;
grant select, insert, update, delete on public.order_items to authenticated;
grant select on public.order_items to anon;

grant insert, update, delete on public.categories, public.products, public.product_images, public.product_variants
  to authenticated;

grant usage, select on sequence public.order_number_seq to anon, authenticated;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.create_order(text, jsonb, jsonb, jsonb, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles
create policy profiles_select_own
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy profiles_select_admin
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy profiles_update_own
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_update_admin
  on public.profiles for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- categories
create policy categories_select_public
  on public.categories for select to anon, authenticated
  using (is_active or public.is_admin());

create policy categories_write_admin
  on public.categories for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- products
create policy products_select_public
  on public.products for select to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy products_write_admin
  on public.products for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- product_images
create policy product_images_select_public
  on public.product_images for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );

create policy product_images_write_admin
  on public.product_images for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- product_variants
create policy product_variants_select_public
  on public.product_variants for select to anon, authenticated
  using (
    public.is_admin()
    or (
      is_active
      and exists (
        select 1 from public.products p
        where p.id = product_id and p.status = 'published'
      )
    )
  );

create policy product_variants_write_admin
  on public.product_variants for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- addresses
create policy addresses_owner_all
  on public.addresses for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy addresses_admin_select
  on public.addresses for select to authenticated
  using (public.is_admin());

-- cart_items
create policy cart_items_owner_all
  on public.cart_items for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy cart_items_admin_select
  on public.cart_items for select to authenticated
  using (public.is_admin());

-- wishlists
create policy wishlists_owner_all
  on public.wishlists for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy wishlists_admin_select
  on public.wishlists for select to authenticated
  using (public.is_admin());

-- orders: customers cannot insert/update/delete directly
create policy orders_select_own
  on public.orders for select to authenticated
  using (user_id = auth.uid());

create policy orders_select_admin
  on public.orders for select to authenticated
  using (public.is_admin());

create policy orders_insert_admin
  on public.orders for insert to authenticated
  with check (public.is_admin());

create policy orders_update_admin
  on public.orders for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Guest checkout cannot SELECT the new row (no user_id). Success page
-- should confirm via a signed token or account lookup — not a public order listing.

-- order_items
create policy order_items_select_own
  on public.order_items for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy order_items_select_admin
  on public.order_items for select to authenticated
  using (public.is_admin());

create policy order_items_write_admin
  on public.order_items for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy product_images_bucket_select
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy product_images_bucket_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy product_images_bucket_update
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy product_images_bucket_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
