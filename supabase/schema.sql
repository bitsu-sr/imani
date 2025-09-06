-- Borrowers table
create table if not exists public.borrowers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  notes text,
  created_at timestamptz not null default now()
);

-- Loans table
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  borrower_id uuid not null references public.borrowers(id) on delete cascade,
  principal numeric(14,2) not null,
  start_date date not null,
  monthly_interest_rate numeric(6,3) not null, -- percent per month
  payment_agreement text, -- 'fixed' | 'flexible' or description
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- Transactions (repayments)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  date date not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_loans_borrower on public.loans(borrower_id);
create index if not exists idx_tx_loan on public.transactions(loan_id);


