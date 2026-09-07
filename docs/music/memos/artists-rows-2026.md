# Artists rows, drafted, ZAOstock 2026

The nine rows the `artists` table needs, one per act on the run of show locked
3 September, in the exact fields the public lineup route reads
(`src/app/api/events/[slug]/lineup/route.ts`: `name, genre, city, bio,
photo_url, socials, set_order`, filtered on `status = 'confirmed'`).

Drafted by IMan on 7 September so that the moment a memo comes back signed,
the row is a paste and a status flip, not a research job. **Status stays
`wishlist` until the act has signed.** Decision 0005.

Genres are the ones locked on 3 September and given to the insurance broker.
Bios are one line each, in the act's own public words where they have any,
and every act still confirms its own line before it renders anywhere.
`photo_url` must be an https link to an image file; a Drive link does not
render. All nine are blank because no act has supplied a cleared photo.

| set_order | name | genre | city | socials | bio | photo_url | status |
|---|---|---|---|---|---|---|---|
| 1 | The Crown Vics | Rock n roll dance band | Ellsworth, ME | facebook.com/thecrownvicsband; youtube.com/channel/UCokZcXVoUljHIC1ZtDshjpw | Maine's rockabilly band: five people from Ellsworth who started as a rock and roll idea and ended up writing their own songs. Debut album Hell Yeah, 2017. | | wishlist |
| 2 | OPEN X | Power pop rock | Maine (town to confirm) | openxofficial.com; open.spotify.com/artist/1d0p84qMITQPDTUBmp1mSU; x.com/OpenXofficial | Power pop rock from Maine, blending electronic pop and indie rock. Played the Franklin Street Parklet in August 2026. | | wishlist |
| 3 | Grass Rug | Jam rock band | (ask) | (ask) | (ask: nothing public exists) | | wishlist |
| 4 | Acadia Rising | World Rhythms / Global Fusion | Ellsworth, ME | instagram.com/acadia.rising; facebook.com/AcadiaRising | Sen Wilde's Ellsworth practice: sound healing, ceremony and restorative experiences, with Women with Rhythm. Replace with the wording in Sen's 25 July submission. | | wishlist |
| 5 | Michael Anderson | Solo piano | Bar Harbor, ME (to confirm) | (none) | Solo piano and vocals. (ask: he has no public bio) | | wishlist |
| 6 | Hurricane | Hip-hop | Houston, TX | x.com/Hurric4n3Ike; farcaster.xyz/hurric4n3ike; open.spotify.com/artist/5x3pUgROCueytLsG0Xy35H | Houston musician and developer. 432 Hz hip hop and R&B, self-produced under Hurric4n3Soundz. | | wishlist |
| 7 | DCoop | Hip-hop | DMV | x.com/dcoopofficial; farcaster.xyz/dcoopofficial; open.spotify.com/artist/4Yy2AYCxNHcRMgRsNJPBY9 | DMV artist blending hip hop with reggae, rock, punk, tribal, country and R&B. Founder of The VEC, an independent label and collective. | | wishlist |
| 8 | Lyons Den | Native / Electro / Reggae / Hip-hop | (ask) | (ask) | (ask: nothing public exists) | | wishlist |
| 9 | Fellenz | Rock guitar and soundtrack | San Francisco Bay Area, CA | linktr.ee/fellenzmusic; instagram.com/fellenzmusic; x.com/fellenzmusic | Rock guitarist and soundtrack composer from the Bay Area. Built NFT Music Hall, a virtual venue that has hosted 40+ musicians. | | wishlist |

## On the day a memo comes back

1. Save the signed memo to `docs/music/deals/<act>-2026.md`.
2. Paste the row above into the `artists` table for the `zaostock` event, fill
   `photo_url` with the hosted image, set `status = 'confirmed'`.
3. Add the act's name to `PUBLIC_LINEUP` in `src/content/site.ts` in the same
   hour. The API and the website read different sources, and doing one without
   the other fails silently (`docs/events/REVEAL-RUNBOOK.md`).
4. Once at least one row is confirmed, `src/lib/lineup-fallback.ts` can carry
   the same rows so the API degrades to a real lineup instead of a 503.

Names on this page are already on `main` in the locked run of show
(`.handoffs/session-2026-09-03-zaostock-travel-window/README.md`). No fees,
no contact details.
