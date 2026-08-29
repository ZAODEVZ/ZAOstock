import { Metadata } from 'next';
import { TeamRetired } from '../TeamRetired';

export const metadata: Metadata = { title: 'Help', robots: { index: false } };

// Retired 2026-08-29 (src/lib/team-status.ts).
export default function TeamHelpPage() {
  return <TeamRetired />;
}
