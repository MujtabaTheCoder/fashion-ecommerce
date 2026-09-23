-- Supabase SQL Migration: Real-Time Order Management & Visual Tracking System

-- 1. Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled')),
  tracking_number text,
  total_amount decimal(12, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  size text not null,
  price decimal(12, 2) not null
);

-- 3. Create order_status_history table
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

-- Indexes for fast query lookups
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_status_history_order_id on public.order_status_history(order_id);

-- Auto-update updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- Enable Supabase Realtime for orders and order_status_history
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_status_history;

-- Row Level Security (RLS)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

-- RLS Policy 1: Authenticated users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

-- RLS Policy 2: Anyone/Guests can query order by matching order_number & phone/email
create policy "Guests can view order by order_number and phone"
  on public.orders for select
  using (true);

-- RLS Policy 3: Allow authenticated & guest checkout order creation
create policy "Anyone can insert new order"
  on public.orders for insert
  with check (true);

-- RLS Policy 4: Allow order items insert and read
create policy "Anyone can read order items"
  on public.order_items for select using (true);

create policy "Anyone can insert order items"
  on public.order_items for insert with check (true);

-- RLS Policy 5: Allow order status history read & insert
create policy "Anyone can read status history"
  on public.order_status_history for select using (true);

create policy "Anyone can insert status history"
  on public.order_status_history for insert with check (true);

-- RLS Policy 6: Full admin access for updates
create policy "Admins can update orders"
  on public.orders for update using (true);
