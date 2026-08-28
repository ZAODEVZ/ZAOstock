import 'server-only';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { FESTIVAL } from '@/content/festival';

// The /press page renders docs/marketing/press-kit.md. MARKETING owns that
// file; this module only finds it. Until it lands, the page renders the
// placeholder below: the fixed facts from src/content/festival.ts, the brand
// files that exist in public/, the contact address, and an explicit UNSET for
// everything nobody has typed yet.
//
// Rules the placeholder obeys, and the test enforces:
// - no performer names (the lineup reveal is 1 September)
// - no attendance figure, no sponsor names, no quotes - UNSET until Zaal types them
// - no tax-deductible language - ZAOstock has no fiscal sponsor

export const PRESS_KIT_PATH = path.join(process.cwd(), 'docs', 'marketing', 'press-kit.md');

export const PRESS_CONTACT = 'info@thezao.com';

// Same eight names as the homepage PARTNERS list (src/app/page.tsx), which
// gates on confirmed === true. If that list changes, change this one.
export const CONFIRMED_PARTNERS = [
  'Town of Ellsworth',
  'Black Moon Public House',
  'Star 97.7',
  'Wallace Events',
  'WaveWarZ',
  'COC Concertz',
  'ENTERACT',
  'Web3Metal',
] as const;

export const PLACEHOLDER_MARKDOWN = `# ZAOstock 2026 press kit

This page is a placeholder. The full press kit is being written and will
replace it here at the same address. Every line below is either a published
fact or marked **UNSET**.

## The facts

| | |
|---|---|
| What | A free, one-day, artist-built music festival in downtown Ellsworth, Maine. Run by The ZAO |
| When | ${FESTIVAL.dateLabel}, ${FESTIVAL.window} |
| Where | ${FESTIVAL.venue}, ${FESTIVAL.city} |
| After | ${FESTIVAL.afterParty.name}, ${FESTIVAL.afterParty.note}, from 6 PM |
| Admission | ${FESTIVAL.admission} |
| RSVP | ${FESTIVAL.rsvpUrl} |

## Lineup

Announced 1 September 2026. No performer is named before then.

## Partners

${CONFIRMED_PARTNERS.map((p) => `- ${p}`).join('\n')}

Sponsors: none signed. Sponsorship is commercial only; ZAOstock has no fiscal
sponsor and no contribution is tax-deductible.

## Brand files

- Official badge (colour): [zaostock26_badge_official.png](/brand/logos/zaostock26_badge_official.png)
- Badge, black and white: [zaostock26_badge_bw_final.png](/brand/logos/zaostock26_badge_bw_final.png)

## Not yet available

| Piece | State |
|---|---|
| Press photos | **UNSET** |
| Artist bios | **UNSET** until the 1 September reveal |
| Attendance figure | **UNSET** |
| Quotes | **UNSET** |
| Press release | **UNSET** - lands with the 1 September reveal |

## Contact

${PRESS_CONTACT}. We read everything and will confirm we got it.
`;

export type PressKit = {
  markdown: string;
  source: 'file' | 'placeholder';
};

/** Read the press kit once at build time. The page is static, so this never runs per request. */
export function loadPressKit(filePath: string = PRESS_KIT_PATH): PressKit {
  if (existsSync(filePath)) {
    const markdown = readFileSync(filePath, 'utf8').trim();
    if (markdown.length > 0) return { markdown, source: 'file' };
  }
  return { markdown: PLACEHOLDER_MARKDOWN, source: 'placeholder' };
}
