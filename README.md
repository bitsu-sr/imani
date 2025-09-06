# Imani Loans

A personal micro-loan manager with monthly interest, built with React (Vite), Vercel Functions, and Supabase.

## Getting Started

1) Prerequisites: Node 18+, a Supabase project.

2) Install frontend:
```
cd apps/frontend
npm install
```

3) Environment variables (create `.env.local` at repo root for Vercel dev):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4) Apply database schema:
- Open Supabase SQL editor and run `supabase/schema.sql` contents.

5) Run frontend dev server:
```
cd apps/frontend
npm run dev
```

6) API routes run on Vercel (`/api/*`). For local dev with Vercel CLI:
```
npm i -g vercel
vercel dev
```

## Deploy
- Push to GitHub and import the repo on Vercel.
- Set project env vars `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Notes
- Payments allocate to interest first, then principal.
- Interest is computed monthly at month end and compounds if unpaid.
