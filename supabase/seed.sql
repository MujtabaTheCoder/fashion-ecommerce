-- Demo catalog for ATELIER. Safe to re-run.
-- In the Supabase SQL editor: run this after the init migration.

insert into public.categories (slug, name, description, sort_order, is_active)
values
  ('women', 'Women', 'Considered silhouettes and everyday essentials.', 1, true),
  ('men', 'Men', 'Quiet luxury in relaxed proportions.', 2, true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = true;

delete from public.product_images
where product_id in (
  select id from public.products
  where slug in (
    'camel-wool-overcoat',
    'ivory-silk-shirt',
    'pleated-wool-trouser',
    'merino-crewneck',
    'column-knit-dress',
    'unstructured-blazer',
    'organic-oxford-shirt',
    'tapered-cotton-chino'
  )
);

delete from public.product_variants
where product_id in (
  select id from public.products
  where slug in (
    'camel-wool-overcoat',
    'ivory-silk-shirt',
    'pleated-wool-trouser',
    'merino-crewneck',
    'column-knit-dress',
    'unstructured-blazer',
    'organic-oxford-shirt',
    'tapered-cotton-chino'
  )
);

insert into public.products (
  category_id,
  slug,
  name,
  description,
  material,
  care_instructions,
  status,
  is_featured,
  published_at
)
values
  (
    (select id from public.categories where slug = 'women'),
    'camel-wool-overcoat',
    'Camel Wool Overcoat',
    'A long, unlined overcoat in double-faced wool. Relaxed shoulders, a concealed placket, and pockets cut to sit clean under a bag strap.',
    '100% wool',
    'Dry clean only',
    'published',
    true,
    now()
  ),
  (
    (select id from public.categories where slug = 'women'),
    'ivory-silk-shirt',
    'Ivory Silk Shirt',
    'A camp-collar shirt in sandwashed silk. Worn open over knitwear or closed as a simple blouse.',
    '100% silk',
    'Dry clean or cool hand wash. Cool iron on reverse.',
    'published',
    true,
    now()
  ),
  (
    (select id from public.categories where slug = 'women'),
    'pleated-wool-trouser',
    'Pleated Wool Trouser',
    'Full-length trousers with a soft front pleat and a fluid drape. High rise, easy through the hip, tapering slightly at the hem.',
    'Virgin wool blend',
    'Dry clean only',
    'published',
    false,
    now()
  ),
  (
    (select id from public.categories where slug = 'women'),
    'merino-crewneck',
    'Fine Merino Crewneck',
    'A lightweight crew in extra-fine merino. Clean neckline, set-in sleeves, and a hem that sits at the hip.',
    '100% extra-fine merino wool',
    'Hand wash cold. Lay flat to dry.',
    'published',
    true,
    now()
  ),
  (
    (select id from public.categories where slug = 'women'),
    'column-knit-dress',
    'Column Knit Dress',
    'A sleeveless column in compact knit. Square neck, midi length, and enough give to wear through the day.',
    'Viscose and nylon knit',
    'Hand wash cold. Lay flat to dry.',
    'published',
    false,
    now()
  ),
  (
    (select id from public.categories where slug = 'men'),
    'unstructured-blazer',
    'Unstructured Blazer',
    'A jacket without padding or canvas. Soft lapel, patch pockets, and a length that works over a tee or shirt.',
    'Wool and linen blend',
    'Dry clean only',
    'published',
    true,
    now()
  ),
  (
    (select id from public.categories where slug = 'men'),
    'organic-oxford-shirt',
    'Organic Oxford Shirt',
    'A straight-cut oxford with a button-down collar and a gently brushed finish. Cut to tuck or leave out.',
    '100% organic cotton',
    'Machine wash cold. Tumble dry low.',
    'published',
    false,
    now()
  ),
  (
    (select id from public.categories where slug = 'men'),
    'tapered-cotton-chino',
    'Tapered Cotton Chino',
    'A tapered chino in garment-dyed cotton twill. Mid rise, easy thigh, and a clean hem.',
    '100% cotton',
    'Machine wash cold. Tumble dry low.',
    'published',
    false,
    now()
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  material = excluded.material,
  care_instructions = excluded.care_instructions,
  status = 'published',
  is_featured = excluded.is_featured,
  published_at = coalesce(public.products.published_at, now());

insert into public.product_images (product_id, storage_path, alt, sort_order, is_primary)
values
  (
    (select id from public.products where slug = 'camel-wool-overcoat'),
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Camel wool overcoat on a figure, three-quarter view',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'ivory-silk-shirt'),
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Ivory silk shirt, front view',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'pleated-wool-trouser'),
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Pleated wool trousers, full length',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'merino-crewneck'),
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Fine merino crewneck sweater',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'column-knit-dress'),
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Column knit dress, midi length',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'unstructured-blazer'),
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Unstructured blazer, relaxed fit',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'organic-oxford-shirt'),
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Organic cotton oxford shirt',
    0,
    true
  ),
  (
    (select id from public.products where slug = 'tapered-cotton-chino'),
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&h=1500&q=80',
    'Tapered cotton chinos',
    0,
    true
  );

insert into public.product_variants (
  product_id,
  sku,
  size,
  color,
  color_hex,
  price_cents,
  compare_at_cents,
  stock,
  is_active
)
values
  ((select id from public.products where slug = 'camel-wool-overcoat'), 'ATL-COAT-CAM-S', 'S', 'Camel', '#C4A574', 42800, 48000, 8, true),
  ((select id from public.products where slug = 'camel-wool-overcoat'), 'ATL-COAT-CAM-M', 'M', 'Camel', '#C4A574', 42800, 48000, 12, true),
  ((select id from public.products where slug = 'camel-wool-overcoat'), 'ATL-COAT-CAM-L', 'L', 'Camel', '#C4A574', 42800, 48000, 6, true),
  ((select id from public.products where slug = 'ivory-silk-shirt'), 'ATL-SHIRT-IVY-XS', 'XS', 'Ivory', '#F4EFE6', 16800, null, 10, true),
  ((select id from public.products where slug = 'ivory-silk-shirt'), 'ATL-SHIRT-IVY-S', 'S', 'Ivory', '#F4EFE6', 16800, null, 14, true),
  ((select id from public.products where slug = 'ivory-silk-shirt'), 'ATL-SHIRT-IVY-M', 'M', 'Ivory', '#F4EFE6', 16800, null, 9, true),
  ((select id from public.products where slug = 'pleated-wool-trouser'), 'ATL-TRSR-BLK-S', 'S', 'Black', '#1A1816', 19800, null, 11, true),
  ((select id from public.products where slug = 'pleated-wool-trouser'), 'ATL-TRSR-BLK-M', 'M', 'Black', '#1A1816', 19800, null, 15, true),
  ((select id from public.products where slug = 'pleated-wool-trouser'), 'ATL-TRSR-BLK-L', 'L', 'Black', '#1A1816', 19800, null, 7, true),
  ((select id from public.products where slug = 'merino-crewneck'), 'ATL-KNT-ECR-S', 'S', 'Ecru', '#E8E0D4', 12800, null, 16, true),
  ((select id from public.products where slug = 'merino-crewneck'), 'ATL-KNT-ECR-M', 'M', 'Ecru', '#E8E0D4', 12800, null, 18, true),
  ((select id from public.products where slug = 'merino-crewneck'), 'ATL-KNT-ECR-L', 'L', 'Ecru', '#E8E0D4', 12800, null, 10, true),
  ((select id from public.products where slug = 'column-knit-dress'), 'ATL-DRS-INK-XS', 'XS', 'Ink', '#2C2A27', 24800, null, 8, true),
  ((select id from public.products where slug = 'column-knit-dress'), 'ATL-DRS-INK-S', 'S', 'Ink', '#2C2A27', 24800, null, 12, true),
  ((select id from public.products where slug = 'column-knit-dress'), 'ATL-DRS-INK-M', 'M', 'Ink', '#2C2A27', 24800, null, 9, true),
  ((select id from public.products where slug = 'unstructured-blazer'), 'ATL-BLZ-NAV-S', 'S', 'Navy', '#2B3344', 34800, null, 7, true),
  ((select id from public.products where slug = 'unstructured-blazer'), 'ATL-BLZ-NAV-M', 'M', 'Navy', '#2B3344', 34800, null, 10, true),
  ((select id from public.products where slug = 'unstructured-blazer'), 'ATL-BLZ-NAV-L', 'L', 'Navy', '#2B3344', 34800, null, 6, true),
  ((select id from public.products where slug = 'organic-oxford-shirt'), 'ATL-OXF-WHT-S', 'S', 'White', '#F7F4EF', 9800, null, 20, true),
  ((select id from public.products where slug = 'organic-oxford-shirt'), 'ATL-OXF-WHT-M', 'M', 'White', '#F7F4EF', 9800, null, 22, true),
  ((select id from public.products where slug = 'organic-oxford-shirt'), 'ATL-OXF-WHT-L', 'L', 'White', '#F7F4EF', 9800, null, 14, true),
  ((select id from public.products where slug = 'tapered-cotton-chino'), 'ATL-CHN-KHA-S', 'S', 'Khaki', '#B7A078', 14800, null, 13, true),
  ((select id from public.products where slug = 'tapered-cotton-chino'), 'ATL-CHN-KHA-M', 'M', 'Khaki', '#B7A078', 14800, null, 16, true),
  ((select id from public.products where slug = 'tapered-cotton-chino'), 'ATL-CHN-KHA-L', 'L', 'Khaki', '#B7A078', 14800, null, 11, true)
on conflict (sku) do update
set
  price_cents = excluded.price_cents,
  compare_at_cents = excluded.compare_at_cents,
  stock = excluded.stock,
  is_active = true;
