// Build-time lineup fallback.
//
// WHY THIS EXISTS
// The public lineup endpoint reads the `artists` table at request time. On
// 2026-08-22 the Supabase org hit its egress quota, REST began returning 402,
// and `/api/events/zaostock-2026/lineup` returned 500 for every caller. The
// quota does not refill until 2026-09-21, which is twelve days before the
// event. A festival lineup should not go blank because a database is
// rate-limited, so the endpoint degrades to this file instead.
//
// WHAT IT IS
// The last known-good confirmed lineup, committed to the repo and therefore
// baked into the bundle at build time. Supabase remains the source of truth
// and enriches at runtime whenever it is reachable; this is only the floor.
//
// THE ONE RULE
// An EMPTY fallback is not a lineup. If this array is empty the endpoint
// returns 503, never `{"artists": []}` with a 200 - because "no confirmed
// artists" and "we could not find out" are different claims, and serving the
// second as the first is the false-green shape this estate keeps getting bitten
// by. Degradation must never become fabrication.
//
// HOW TO POPULATE IT
// Add one entry per CONFIRMED artist, copied from the `artists` table (or from
// whoever holds the roster) - never invented, never inferred from a chat
// message. Update `AS_OF` in the same edit so consumers can see the age.
// Anything not confirmed does not belong here.

import { canonicalEventSlug } from '@/lib/event-slugs';

export interface FallbackArtist {
  id: string;
  name: string;
  genre: string;
  city: string;
  bio: string;
  photo_url: string;
  socials: string;
  set_order: number | null;
}

/** ISO date the entries below were last reconciled against the real roster. */
export const AS_OF = '2026-09-23';

/**
 * Confirmed artists, by event slug.
 *
 * COPIED, NOT WRITTEN. Generated on 2026-09-23 from a single live read of
 * GET https://zaostock.com/api/events/zaostock-2026/lineup, which answered
 * source "live", published true, pending 0, 8 artists. Every field below is that
 * response verbatim, ordered by set_order (there is no set 6 in the source).
 * To refresh: re-read the endpoint when it says source "live" and pending 0,
 * replace the array, and move AS_OF - never edit a name or bio by hand.
 */
export const LINEUP_FALLBACK: Record<string, FallbackArtist[]> = {
  // Keyed by the slug the events table uses. The mobile app's 'zaostock-2026'
  // used to need its own duplicate key here; it is resolved by
  // canonicalEventSlug now, in the one place that owns the alias, so that the
  // live path and the degraded path cannot disagree about which event a slug
  // means.
  zaostock: [
    {
      id: "aedc603c-1dd0-4ea6-b257-792a3882c615",
      name: "The Crown Vics",
      genre: "Rock n roll dance band",
      city: "",
      bio: "The Crown Vics are Maine's premier rock 'n' roll dance band. Built on the bones of rockabilly, boogie woogie, and honky tonk, twisted through classic rock, Americana, indie, and whatever else catches their ear. They've played everywhere from Portland to Halifax, from ski resorts to theaters, from corporate events to bar stages. No long solos. No slow fades. Hardly a breath between numbers. Every night is a show. Every show is an experience.",
      photo_url: "https://zaostock.com/artists/the-crown-vics.webp",
      socials: "https://facebook.com/TheCrownVics https://reverbnation.com/thecrownvics",
      set_order: 1,
    },
    {
      id: "9385596c-75c5-441a-ac77-b95a0c38ff15",
      name: "OPEN X",
      genre: "Power pop rock",
      city: "",
      bio: "OPEN X is best described as a bombastic, genre-blurring American rock power pop trio known for their cinematic sound, classical influences, and spectacular stadium-sized live shows. While rooted in alternative rock, OPEN X seamlessly blends progressive rock, heavy metal, and modern pop. They are famous for thick, heavy guitar riffs contrasted against delicate vocal melodies. A massive part of their identity is Ryan Miller's dramatic, soaring and emotional vocal delivery. Despite having only three members, they produce an incredibly dense, symphonic wall of sound, anchored by driving basslines and precise, hard-hitting percussion.",
      photo_url: "https://zaostock.com/artists/open-x-logo.webp",
      socials: "https://openxofficial.com",
      set_order: 2,
    },
    {
      id: "bc1900bb-9582-4edc-a725-2d51d7929171",
      name: "Grass Rug",
      genre: "Indie jam rock",
      city: "Portland, Maine",
      bio: "Grass Rug is a rock band from Portland, Maine, known for their indie jam-rock sound. Formed in 2025, the group consists of vocalist and rhythm guitarist Sam Mitchell, lead guitarist Jack Howianec, rhythm guitarist Jacob Mitchell, bassist Donny Bowman, and drummer Peter Coleman. Grass Rug is heavily inspired by psychedelic 60s and 70s rock, as well as 90s alternative rock and 2010s indie. Grass Rug delivers unforgettable improvisational live performances, drawing audiences in southern, central, and downeast Maine.",
      photo_url: "https://zaostock.com/artists/grass-rug.webp",
      socials: "",
      set_order: 3,
    },
    {
      id: "f3affe3f-58f2-4b0c-8513-201bcc282a3c",
      name: "Acadia Rising",
      genre: "World Rhythms / Global Fusion",
      city: "Ellsworth, Maine",
      bio: "Acadia Rising produces original flute and hand percussion music that blends global musical influences with the natural beauty of Maine. Featuring expressive flute melodies, dynamic rhythms, and improvisation, each piece is inspired by landscapes, cultures, and traditions from around the world while reflecting a unique contemporary voice. The performance invites listeners on a musical journey that celebrates rhythm, connection, and the universal language of music.",
      photo_url: "https://zaostock.com/artists/acadia-rising.webp",
      socials: "https://facebook.com/AcadiaRising https://instagram.com/acadia.rising",
      set_order: 4,
    },
    {
      id: "53905045-9ebf-4bda-b7b9-61f0ba869bc7",
      name: "Michael Anderson",
      genre: "Solo piano",
      city: "Bar Harbor",
      bio: "Michael has a deep background linking an outstanding voice with clever keyboard performance. He is at home as a solo act, delivering a very full sound, or in the numerous bands he has performed with. A resident of Bar Harbor with roots in blues, soul, and jazz, he is at home performing jazz standards as well as popular hits. \"I find it very important to connect with my audience.\" More than just a musician, he delivers a riveting performance that engages his audience. As a student of jazz and a lifetime love of music, he delivers a memorable sound.",
      photo_url: "https://zaostock.com/artists/michael-anderson.webp",
      socials: "",
      set_order: 5,
    },
    {
      id: "825ab8df-4ee3-4667-81b2-57cf3b79ac1d",
      name: "DCoop",
      genre: "Hip-hop, reggae, rock, punk, tribal, country, EDM and R&B",
      city: "The DMV",
      bio: "Coop @dcoopofficial on all platforms, born from the roots of classic hip hop, is an innovative artist whose versatility knows no bounds. Blending hip hop with Reggae, Rock, Punk, Tribal, Country, EDM, and R&B, he creates a genre defying sound that honors tradition while breaking new ground. Much of DCoop's music integrates spiritual frequencies (432-900 Hz), crafted to resonate deeply and promote conscious healing beyond conventional limits.",
      photo_url: "/artists/dcoop.webp",
      socials: "@dcoopofficial - https://dot.cards/dcoope2",
      set_order: 7,
    },
    {
      id: "7acb60ec-1c99-4331-96bf-749a2bed011f",
      name: "LyonsDen",
      genre: "Native / Electro / Reggae / Hip-hop",
      city: "",
      bio: "LyonsDen Rez Muzik is a Native American, self-produced independent artist from the Onondaga Reservation, carving out a lane where reggae roots, hip-hop grit, blues soul, R&B melodies, and EDM energy collide. Blending uplifting island vibes with raw Rez storytelling, LyonsDen delivers music that's both healing and hard-hitting - a soundtrack for resilience, love, laughter, and leveling up.\n\nEmerging from the SouthEnd with a mission bigger than music, LyonsDen Rez Muzik has steadily built momentum through authentic storytelling and grassroots hustle. After releasing multiple singles and the EP \"Tales From SouthEnd,\" the movement expanded with the debut album \"The SouthEnd Kid,\" showcasing growth, vulnerability, and undeniable versatility. From romantic anthems to humorous Rez punchline records to deeply reflective tracks about overcoming adversity, LyonsDen's catalog reflects real life on the reservation - unfiltered and unapologetic.\n\nThe live energy matches the message. LyonsDen Rez Muzik earned a spot at SXSW after winning a Battle of the Bands and later joined the Beyond The Block Tour, proving the sound translates far beyond the Rez. International collaborations with artists from the Netherlands and Belgium, along with multiple YouTube reaction features, continue to grow a global audience.\n\nMore than just music, LyonsDen Rez Muzik represents independent spirit - writing, recording, and producing with a DIY ethic that inspires other Native artists to own their narratives. With infectious hooks, clever wordplay, and an unmistakable vibe, LyonsDen Rez Muzik is turning personal trials into powerful triumphs - one track at a time.",
      photo_url: "/artists/lyons-den.webp",
      socials: "",
      set_order: 8,
    },
    {
      id: "a623897a-ae17-47f1-b0dd-b3b7721d6bbd",
      name: "Tom Fellenz",
      genre: "Solo Instrumental Acoustic Guitar",
      city: "SF Bay Area",
      bio: "A dynamic acoustic guitar instrumentalist, Tom has broad performance experience across event stages, clubs, cafes, house concerts and online/virtual platforms. His sets showcase a blend of influences, with his original music styled by 70s and 80s progressive rock, smooth jazz, and acoustic folk. His playing style has a cinematic quality, having listeners say his music takes them on immersive journeys, from introspective motivation to making your mark in the world; all from one guitar.",
      photo_url: "https://pbs.twimg.com/profile_images/2062609763637293056/iU6Pe_nU_400x400.jpg",
      socials: "https://fellenz.net",
      set_order: 9,
    },
  ],
};

export function getFallbackLineup(slug: string): FallbackArtist[] {
  return LINEUP_FALLBACK[canonicalEventSlug(slug)] ?? [];
}
