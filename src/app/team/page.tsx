import { Metadata } from 'next';
import { TeamRetired } from './TeamRetired';

export const metadata: Metadata = { title: 'Team', description: 'The ZAOstock team works from the working document.', robots: { index: false } };

// Retired 2026-08-29 (src/lib/team-status.ts). The dashboard, the login form
// and the roster grid that lived here are in git history, not on the site.
export default function TeamPage() {
  return <TeamRetired />;
}
