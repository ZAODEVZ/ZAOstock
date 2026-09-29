import { Metadata } from 'next';
import { TeamRetired } from '../TeamRetired';

export const metadata: Metadata = { title: 'One-pager', robots: { index: false } };

// Retired 2026-08-29 (src/lib/team-status.ts). The public one-pagers were removed 2026-09-29; /sponsor is the brief.
export default function TeamOnepagerPage() {
  return <TeamRetired what="The sponsor brief is at /sponsor." />;
}
