# ATELIER

Premium fashion e-commerce storefront built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

This repository is currently in the **foundation** phase: design system, routing shells, typed Supabase clients, and the database migration. Shop, cart, checkout, auth, and admin logic are not implemented yet.

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- npm

## Local setup

1. Clone this repository and install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy .env.local.example .env.local
```

On macOS/Linux use `cp .env.local.example .env.local`.

3. In the Supabase dashboard, open **Project Settings → API** and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; not required for normal app traffic)

4. Apply the database schema. In the Supabase SQL editor, run:

- `supabase/migrations/20260905120000_init.sql`
- optionally `supabase/seed.sql` (creates Women / Men categories)

Or, if you use the Supabase CLI against this project:

```bash
npx supabase db push
```

5. After the schema exists, regenerate TypeScript types when the schema changes:

```bash
npx supabase gen types typescript --project-id <project-ref> > types/database.ts
```

6. Promote your first admin (SQL editor), replacing the email with your Auth user:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

7. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Stack

- Next.js 16 App Router, React 19, TypeScript (strict)
- Tailwind CSS v4
- Supabase (Postgres, Auth, Storage, RLS)
- Deploy target: Vercel

## Project layout

- `app/` — routes (storefront, auth, account, admin)
- `components/ui/` — design-system primitives
- `components/layout/` — header, footer, shells
- `lib/supabase/` — browser, server, middleware, and service-role clients
- `lib/data/` — typed read layer (stubs until catalog work)
- `lib/actions/` — server actions (stubs until mutations)
- `supabase/migrations/` — schema, RLS, `create_order` RPC
- `types/database.ts` — generated-style Database types (replace after `gen types`)

## Security notes

- Never commit `.env.local` or the service role key.
- Customer traffic must use the anon key; Row Level Security is the access control.
- `create_order` is the only customer path that inserts orders (security definer). Direct table inserts are denied by RLS.
