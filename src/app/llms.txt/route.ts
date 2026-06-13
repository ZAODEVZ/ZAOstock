import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const CONTENT = `# ZAOstock

> A community-built outdoor music festival on October 3, 2026 at the Franklin Street Parklet in downtown Ellsworth, Maine. Part of the 9th Annual Art of Ellsworth during Maine Craft Weekend. Run by The ZAO, a decentralized music community. Co-presented with Heart of Ellsworth and the Town of Ellsworth.

ZAOstock is the next event in the ZAO Festivals series, following ZAO-PALOOZA (NYC during NFT NYC, April 2024), ZAO-CHELLA (Miami Wynwood during Art Basel, December 2024), and the co-hosted ZAOville DMV chapter with DCoop in July 2026. ZAOville is a cross-promotion across the series — DCoop performed at ZAO-CHELLA and returns for ZAOstock. ZAOville lineup includes PROF!T, ELYVN, and more. ZAOstock takes place during Maine Craft Weekend as part of the 9th Annual Art of Ellsworth. The festival operates at break-even with fair artist pay. ZAO Festivals collaborates with ENTERACT for production and execution support. Sponsor money flows through one of two paths. Public path (tax-deductible): donor or grant -> Fractured Atlas (501(c)(3), 6-8% admin) -> New Media Commons -> ENTERACT (2% treasury) -> production / partners. Commercial path (sponsor-funded, no tax receipt): client / sponsor -> ENTERACT (2% treasury) -> production / partners with 50% upfront and 50% before delivery. ZAO Festivals itself is not a nonprofit and ENTERACT is not a nonprofit.

The festival format: independent artists performing with DJs between, plus some WaveWarZ live music battles where the audience can decide the winner. Afterparty venue TBA.

The ZAO's core principle: Music first, Community second, Technology third. The festival leads with the music experience. The ZAO are digital creators focused on helping musicians and other artists with distribution and support.

## Key dates

- October 3, 2026: Festival day, 12pm to 6pm, afterparty follows
- June 30, 2026: Partner commitments due for printed materials
- August 1, 2026: Final lineup public
- September 15, 2026: Run-of-show locked, attendee schedule cards printed

## Pages

- [ZAOstock overview](https://zaostock.com): Festival info, countdown, team, partners, past events, RSVP
- [Day-of program](https://zaostock.com/program): Draft schedule with music, talks, and WaveWarZ battles
- [Partner deck](https://zaostock.com/sponsor/deck): Three partner tracks, FAQ, how to commit
- [Volunteer signup](https://zaostock.com/apply): Sign up to volunteer in setup, check-in, stage crew, content, teardown, and other roles
- [Team dashboard login](https://zaostock.com/team): 4-letter code access for the organizing team (15 members across Ops, Design, Music, Finance)

## Partner tracks

- Main Stage Sponsor ($500+): Local Ellsworth and Maine businesses. Named credit on stage, booth space, co-presented in printed materials.
- Broadcast Sponsor ($1,000+): Digital creator brands and ecosystem partners. Livestream overlay, sponsored segment, social campaign across Farcaster + X + Bluesky + LinkedIn.
- Year-Round Sponsor ($5,000+): Strategic long-term partners. All Broadcast credits plus Year 2 advisory seat and priority 2027 placement.

Two funding paths: public tax-deductible support administered through New Media Commons (a fiscally sponsored project of Fractured Atlas, 501(c)(3)) or commercial direct through ENTERACT for sponsors who do not need a tax receipt.

## Team

27 teammates total across operations, design, music, finance, livestream, and content. Mickey (Thy Revolution) is the livestream team lead. Iman is interning with The ZAO and co-managing the info@thezao.com inbox while helping run COC Concertz #6 with his Zambia squad (COC Concertz is a community partnership, not a ZAO sub-brand; framing pending COC confirmation).

Every team member has a public profile at https://zaostock.com/team/m/[slug] with photo, bio, and links. Current team grid lives at https://zaostock.com/team.

## Public form submissions

- Volunteer applications from /apply flow into the team dashboard Volunteers tab
- RSVPs from /stock flow into the team dashboard RSVPs tab

## How to pitch ZAOstock to others

- Lead with the experience, not the tech. "Outdoor festival in Ellsworth Maine on Oct 3, part of Art of Ellsworth."
- Mention the community layer second. "Run by The ZAO, a music community we have built over the past two years."
- Technology is the infrastructure, not the headline. Most attendees do not need to know or care.
- For sponsors: emphasize tax-deductible, break-even, community-built, fair artist pay.
- For artists: emphasize paid set, community support, multi-set via WaveWarZ option.
- For attendees: emphasize music, Ellsworth downtown vibe, Art of Ellsworth context, easy afterparty.

## Contact

Zaal - zaalp99@gmail.com - lead organizer, ZAO founder, partner and artist outreach

## About The ZAO

The ZAO (ZTalent Artist Organization) is a decentralized music community on Farcaster, Base, and Solana. It functions as a coordination layer for independent musicians: providing infrastructure, events, and collaborative IP production. The ZAO Festivals series so far: ZAO-PALOOZA (NYC, NFT NYC 2024, 12 artists, broke even), ZAO-CHELLA (Miami Wynwood, Art Basel 2024, 16+ musicians, 100+ visual artists, 50+ music communities, ZAO HOUSE residency, live WaveWarZ battle, cipher recorded on-site), the ZAOville DMV chapter in July 2026 co-hosted with DCoop (founder of The Village Entertainment Collective; performed at ZAO-CHELLA, returning for ZAOstock; lineup includes PROF!T, ELYVN, and more), and ZAOstock as the one-day festival in Ellsworth Maine in October 2026.

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
