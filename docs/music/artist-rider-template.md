# Artist Performance & Participation Rider - Template

> **Status:** v1, June 2026
> **Format:** One-document rider + information packet, friendly tone, fillable per artist
> **Pairs with:** `artist-deal-memo-template.md` (the deal memo confirms the booking; this rider
> collects day-of logistics). The deal memo references a "technical rider intake form" - this is it.
> **Web version:** Confirmed artists can fill this online at `/musicians/rider` (writes to the
> `artists` table on ZAO STOCK Supabase). This doc is the source of truth + the offline fallback.

---

# [EVENT NAME] - Artist Performance & Participation Rider

Thank you for being part of [EVENT NAME]. We're excited to have your artistry, energy, and presence.

This is the official event rider and information packet. Please complete all applicable sections by
the requested deadline (**[DEADLINE]**) so we can run a smooth, organized, successful event.

---

## 1. Artist information

| Field | Your answer |
|---|---|
| Artist / band name | |
| Email | |
| Social media handles | |
| Streaming profiles | |
| Website / other media (labeled) | |
| Artist bio | |

## 2. Performance schedule

- Artist arrival: **[ARRIVAL TIME] latest.**
- Set times are assigned by event management and are slightly tentative.
- Times are not selected by artists, but adjustment requests are considered if submitted before
  **[DEADLINE]**.
- All artists must arrive by the designated arrival time. Late arrival may result in a shortened set
  or removal from the lineup.

**Lineup:** [paste assigned lineup here]

**Response:** `ACCEPTED` or describe your requested change: ______________________

## 3. Equipment check

Provided by [VENUE / PRODUCTION PARTNER]:

- DJ sound management
- Wireless mic(s) + headset mic
- Stage monitors

Outside of these essentials, artists provide their own equipment.

**Response:** `ACCEPTED`, or list vital / convertible equipment (vocal modulators, guitars, DI,
anything not listed): ______________________

> The host is not responsible for lost, stolen, or damaged property.

## 4. Audio & backing track submission

- Deadline: **[AUDIO DEADLINE]**, preferably via the web form.
- Submit a zipped folder of your set, each track labeled in order with artist + song name.
- Or paste links (Dropbox / Drive / WeTransfer / Audius). For anything else, reach out to
  **[AUDIO CONTACT]** promptly.

## 5. Merchandise

Will you be selling merch? `YES` / `NO`

If YES:

- Merch type(s): Apparel / Physical Music / Stickers / Posters / Other: ____________
- Table space: need table space / providing my own
- Managed by: ____________

> Selling merch? Arrive before [ARRIVAL TIME] to secure a spot. The host is not responsible for lost,
> stolen, or damaged merchandise.

## 6. Pre-show artist interview

Optional featured interview (facilitated by [INTERVIEW HOST]) for promo, artist spotlights, social
content, press, and community engagement.

Interested? `YES` / `NO`

If YES:

- Preferred format: In-person / Virtual / Either
- General availability (e.g. Mondays 1-4 PM, Weds 5-10 PM): ____________

## 7. Artist retreat & collaborative growth session

Optional session (facilitated by [RETREAT HOST]) to build relationships between artists, encourage
collaboration, share resources, and strengthen the local music community. In-person preferred.

Interested? `YES` / `NO`

If YES:

- Preferred format: In-person / Virtual / Either
- General availability: ____________

## 8. Artist acknowledgement

By signing below and submitting, I acknowledge that I have read and understand this rider and agree
to abide by the event guidelines and expectations. I grant approved event staff permission to
capture and use photography, video, livestream clips, promotional content, and recap content related
to the event. I understand that artists retain ownership of their original music and intellectual
property. I acknowledge this event is designed to foster genuine community and collaboration, and
while not mandatory, artists are strongly encouraged to stay and support fellow performers, network,
participate in collaborative content, engage respectfully with venue staff and guests, and
contribute positively to the overall experience.

**Signature (type your name):** ______________________  **Date:** ____________

---

## How to use this template

1. Copy this file. Replace `[BRACKETED]` placeholders with the event's real values.
2. For ZAOstock, the standing values are:
   - Venue / production: The VEC (DMV events) or ENTERACT (ZAOstock production support)
   - Audio contact: DCoop
   - Interview + retreat host: DCoop
3. Send to confirmed artists as a PDF / rich-text email, or point them at `/musicians/rider`.
4. Online submissions land on the `artists` table (`notes` field, labeled `ARTIST RIDER RESPONSE`).
   Uploaded backing tracks land in the `stock-attachments` bucket under `artist/<id>/tracks/` and
   are indexed in `notes` as `TRACK FILE:` lines.

## What this rider intentionally does NOT cover

- Fees, travel, lodging, cancellation, insurance - those live in the deal memo.
- This rider is logistics + consent only. Keep the two documents separate so artists sign the
  agreement (deal memo) once and update logistics (rider) as the date approaches.

## Updates

v1, June 2026 by Music circle. Revise after the first event run if any section causes friction.
