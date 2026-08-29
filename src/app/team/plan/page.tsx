import { Metadata } from 'next';
import { TeamRetired } from '../TeamRetired';

export const metadata: Metadata = { title: 'The plan', robots: { index: false } };

// The plan that lived here is docs/plans/team-plan-export-2026-08-29.md and
// the working document (retired 2026-08-29, src/lib/team-status.ts).
export default function TeamPlanPage() {
  return <TeamRetired what="The plan that lived on this page is in the document." />;
}
