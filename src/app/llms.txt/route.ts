import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const CONTENT = `# ZAOstock

> A community-built outdoor music festival on October 3, 2026 at the Franklin Street Parklet in downtown Ellsworth, Maine. Part of the 9th Annual Art of Ellsworth during Maine Craft Weekend. Run by The ZAO, an independent community of musicians and digital creators. Co-presented with the Town of Ellsworth.

ZAOstock is the next event in the ZAO Festivals series, following ZAO-PALOOZA (NYC during NFT NYC, April 2024), ZAO-CHELLA (Miami Wynwood during Art Basel, December 2024), and the co-hosted ZAOville DMV chapter with DCoop in July 2026. ZAOville is a cross-promotion across the series — DCoop performed at ZAO-CHELLA and returns for ZAOstock. ZAOville lineup includes PROF!T, ELYVN, and more. ZAOstock takes place during Maine Craft Weekend as part of the 9th Annual Art of Ellsworth. The festival operates at break-even with fair artist pay. ZAO Festivals collaborates with ENTERACT for production and execution support. Sponsor money flows one way: client / sponsor -> ENTERACT (2% treasury) -> production / partners, with 50% upfront and 50% before delivery. Sponsorship is a commercial arrangement and no tax receipt is issued. ZAOstock has no fiscal sponsor, so there is no tax-deductible path and contributions are not tax-deductible. ZAO Festivals itself is not a nonprofit and ENTERACT is not a nonprofit.

The festival format: independent artists performing with our MC and our partners between sets, plus some WaveWarZ live music battles where the audience can decide the winner. Afterparty at Black Moon Public House in downtown Ellsworth.

## Confirmed partners

Town of Ellsworth (parklet venue), Black Moon Public House (indoor stage and official after-party), Star 97.7 (local radio), Wallace Events (equipment and tenting), WaveWarZ (live music-battle format), COC Concertz (community partnership, monthly virtual concerts), ENTERACT (production and operational support), Web3Metal (partnership integration and community surface). Heart of Ellsworth is not a listed partner until they confirm in writing.

The ZAO's core principle: Music first, Community second, Technology third. The festival leads with the music experience. The ZAO are digital creators focused on helping musicians and other artists with distribution and support.

## Key dates

- October 3, 2026: Festival day. Music from noon on the Franklin Street Parklet until six, then everyone walks next door to Black Moon Public House for the evening. One venue at a time
- June 30, 2026: Partner commitments due for printed materials
- Lineup goes public once every set is locked
- September 15, 2026: Run-of-show locked, attendee schedule cards printed

## Pages

- [ZAOstock overview](https://zaostock.com): Festival info, countdown, team, partners, past events, RSVP
- [Day-of program](https://zaostock.com/program): Draft schedule with music, talks, and WaveWarZ battles
- [Sponsor](https://zaostock.com/sponsor): why, who we are, five packages (prices on request), sponsor an artist, next step
- [Volunteer signup](https://zaostock.com/apply): Sign up to volunteer in setup, check-in, stage crew, content, teardown, and other roles
- [Team dashboard login](https://zaostock.com/team): 4-letter code access for the organizing team (27 members across operations, design, music, finance, livestream, and content)

## Partner tracks

- Main Stage Sponsor ($500+): Local Ellsworth and Maine businesses. Named credit on stage, booth space, co-presented in printed materials.
- Broadcast Sponsor ($1,000+): Digital creator brands and ecosystem partners. Livestream overlay, sponsored segment, social campaign across Farcaster + X + Bluesky + LinkedIn.
- Year-Round Sponsor ($5,000+): Strategic long-term partners. All Broadcast credits plus Year 2 advisory seat and priority 2027 placement.

One funding path: commercial, direct through ENTERACT. No tax receipt is issued and there is no tax-deductible route.

## Team

27 teammates total across operations, design, music, finance, livestream, and content. Mickey (Thy Revolution) is the livestream team lead. Iman is interning with The ZAO and co-managing the info@thezao.com inbox while helping run COC Concertz #6 with his Zambia squad (COC Concertz is a community partnership, not a ZAO sub-brand).

Every team member has a public profile at https://zaostock.com/team/m/[slug] with photo, bio, and links. Current team grid lives at https://zaostock.com/team.

## Public form submissions

- Volunteer applications from /apply flow into the team dashboard Volunteers tab
- RSVPs from /stock flow into the team dashboard RSVPs tab

## How to pitch ZAOstock to others

- Lead with the experience, not the tech. "Outdoor festival in Ellsworth Maine on Oct 3, part of Art of Ellsworth."
- Mention the community layer second. "Run by The ZAO, a music community we have built over the past two years."
- Technology is the infrastructure, not the headline. Most attendees do not need to know or care.
- For sponsors: emphasize break-even, community-built, fair artist pay. Do NOT describe any contribution as tax-deductible.
- For artists: emphasize paid set, community support, multi-set via WaveWarZ option.
- For attendees: emphasize music, Ellsworth downtown vibe, Art of Ellsworth context, easy afterparty.

## Contact

Zaal - info@thezao.com - lead organizer, ZAO founder, partner and artist outreach

## About The ZAO

The ZAO (ZTalent Artist Organization) is a independent community of musicians and digital creators. It functions as a coordination layer for independent musicians: providing infrastructure, events, and collaborative IP production. The ZAO Festivals series so far: ZAO-PALOOZA (NYC, NFT NYC 2024, 12 artists, broke even), ZAO-CHELLA (Miami Wynwood, Art Basel 2024, 16+ musicians, 100+ visual artists, 50+ music communities, ZAO HOUSE residency, live WaveWarZ battle, cipher recorded on-site), the ZAOville DMV chapter in July 2026 co-hosted with DCoop (founder of The Village Entertainment Collective; performed at ZAO-CHELLA, returning for ZAOstock; lineup includes PROF!T, ELYVN, and more), and ZAOstock as the one-day festival in Ellsworth Maine in October 2026.

More on The ZAO: https://zaoos.com
`;

export async function GET() {
  return new NextResponse(CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
