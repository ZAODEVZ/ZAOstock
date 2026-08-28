import { permanentRedirect } from 'next/navigation';

// /pitch was a longer /sponsor with the same numbers. Folded into /sponsor on
// 2026-08-27 (docs/design/redesign-2026-08-28.md, route 9). Two things it
// carried are deliberately not on /sponsor until Zaal says so: the ENTERACT
// payment-route line (UNSET whether ENTERACT may be named) and the four
// funding paths. "Runs at break-even" moved to /sponsor "Who we are".
export default function PitchRedirect() {
  permanentRedirect('/sponsor');
}
