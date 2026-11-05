-- Who referred a sponsor, for the finder's fee (docs/sponsor/finders-fee-structure.md).
-- Written 2026-10-22. NOT RUN. Zaal runs this against the ZAOstock Supabase project
-- BEFORE the PR that adds referred_by to /api/team/sponsors is merged: until the
-- column exists, a POST or PATCH that sends referred_by fails.
-- Additive and nullable, so existing rows and existing reads are unaffected.

alter table public.sponsors
  add column if not exists referred_by text;

comment on column public.sponsors.referred_by is
  'Name of the person who referred this sponsor. The finder''s fee is paid to them.';
