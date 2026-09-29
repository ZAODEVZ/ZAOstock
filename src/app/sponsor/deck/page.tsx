import { permanentRedirect } from 'next/navigation';

// /sponsor absorbed the deck on 2026-08-27 (docs/design/redesign-2026-08-28.md,
// route 4). Two routes saying the same thing in two voices drifted apart.
// Target is #get, where the "Packages on request" card lives: the #packages
// section the redesign spec named no longer exists (SEO pass 2026-09-29).
export default function SponsorDeckRedirect() {
  permanentRedirect('/sponsor#get');
}
