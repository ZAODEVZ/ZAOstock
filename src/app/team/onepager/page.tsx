import { Metadata } from 'next';
import { TeamRetired } from '../TeamRetired';

export const metadata: Metadata = { title: 'One-pager', robots: { index: false } };

// Retired 2026-08-29 (src/lib/team-status.ts). The public one-pager is /onepagers/overview.
export default function TeamOnepagerPage() {
  return <TeamRetired what="The public one-pager is at /onepagers/overview." />;
}
