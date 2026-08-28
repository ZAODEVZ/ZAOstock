import { permanentRedirect } from 'next/navigation';

// /sponsor absorbed the deck on 2026-08-27 (docs/design/redesign-2026-08-28.md,
// route 4). Two routes saying the same thing in two voices drifted apart.
export default function SponsorDeckRedirect() {
  permanentRedirect('/sponsor#packages');
}
