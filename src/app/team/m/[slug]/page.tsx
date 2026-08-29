import { notFound } from 'next/navigation';

// Public member profiles are retired with the dashboard (2026-08-29,
// src/lib/team-status.ts): the roster is not a public surface any more.
export default function MemberProfilePage() {
  notFound();
}
