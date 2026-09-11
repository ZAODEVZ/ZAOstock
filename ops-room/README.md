# ZAOstock Ops Room

One page that runs the day. The public side is where anyone lands, finds the
schedule, watches, and asks a human for help. The team side, behind a code, is
where the crew and the artists work: the run of show with owners and
seconds, the artist advance, the help queue, the moderator rota, the squads.

Built for **Saturday 3 October 2026**, Franklin Street Parklet, Ellsworth,
Maine. Eight acts, music 12:05 to 17:46, street clears at six. Black Moon Public House
next door feeds the performers and hosts its own afterparty after six.

---

## Why it exists

ZAOstock expects **200 to 250 people on the parklet and about 1,000 online**.
The online audience is four times the physical one, and going into September it
had no single surface: the schedule lived in a Google Doc, the links lived in a
chat thread, and someone in the crowd who needed help had no way to say so
except finding a person in a crowd.

This is that surface. It has one job on the day: **everyone knows what is
happening, where, and what to tell the public, at the same moment.**

Three problems it was built to close:

1. **Nobody could see the same picture.** The run of show, the owners, the
   seconds and the open questions were spread across fourteen document tabs.
   Here they are one screen that updates itself against the clock.
2. **A person needing help had no route in.** Now they fill one form and it
   lands in a queue a named human claims, and they can watch their own request
   move from waiting, to who has it, to handled.
3. **Artists were being advanced over chat.** Nine acts, ten things each: 90
   items that were living in people's heads. They are now a board you tick.

---

## The two sides

### Everyone — no sign-in, nothing hidden

| Screen | What it is |
| --- | --- |
| The Waiting Room | Where you land. The theme plays, the countdown runs, and on the day it becomes on-now / up-next. |
| Watch and Listen | Stream, Spaces and the build. Each tile reads "Soon" until the crew fills the URL in. |
| The Day | The full running order with the current slot lit. |
| Get Help | The request form. Goes straight to the crew board. |
| Your Profile | Your requests and their live status, plus anything the crew sent you. |
| Links | Every ZAOstock and ZAO URL, searchable from the command palette. |

### Team — one code, `Ctrl K` from anywhere

Crew and artists use the same code.

| Screen | What it is |
| --- | --- |
| Ops Board | Live counters, what to say to the public right now, the lineup switch, a time simulator. |
| Help Queue | Incoming requests. Claim one with your name; mark it sorted. |
| Messages | Send to a handle. It appears in that person's profile. |
| Needs Attention | Every open item with an owner. Tap the chip: blocked → moving → done. |
| Run of Show | The grid with owner and second on every line, and red flags where a name is missing. |
| Artist Advance | Eight acts × ten advance items, ticked together. |
| Artist Kit | A personalised pack per act: their set time, the day, hospitality, and only what they still owe. One button copies it. |
| Moderator Rota | Twelve seats, two an hour, noon to six. Click a seat to claim it. |
| Agent Squads | Seven roles a teammate can hand to an agent, with a paste-ready brief each. |
| Channels | Where the audience goes. Fill these and the public tiles go live. |
| Broadcast | Post an announcement to the public side. |

---

## How identity works, and what is deliberately not stored

There is **no audience sign-in**. The help request is the identification point:
name and a way to be reached are required, an X or Farcaster handle is optional.

What someone types is kept **on their own device** so the form prefills and
their profile can follow the request. Only what they actively send to the crew
reaches the shared board.

The page saves shared state by republishing itself, which means **anything in
shared state is readable by anyone who can open the app.** So:

- **Never put money figures, personal phone numbers or contracts in this page.**
- The organizing document is deliberately **not** linked. It is readable by
  anyone with the link and carries 29 dollar figures. The crew tile says so.
- The team code is a **curtain, not a lock.** Anyone who can view the page can
  read its source. It keeps the ops board out of the way of the public; it is
  not a security boundary, and nothing in the page should need one.

---

## Running it

```bash
node ops-room/build.js     # writes ops-room/ops-room.html and public/ops/index.html
node ops-room/serve.js     # serves it on http://localhost:4173
```

Open `ops-room/ops-room.html` directly if you prefer. It has no server
dependency once built: that copy is the artifact build, everything inlined.

`public/ops/index.html` is the site build, what zaostock.com/ops returns. The
marks and photographs are inlined there too, but the theme is linked from
`public/ops/assets/zaostock.mp3` (the build copies it), because 3.2 MB of MP3
as base64 made the page 4.96 MB and a phone took up to a minute to open it.

### Files

```
ops-room/
  ops-room.src.html   the app. Edit this, never the built file.
  build.js            builds both copies; inlines the marks and photographs,
                      inlines the theme for the artifact and links it for the site
  serve.js            a static server for local checking
  assets/
    zaostock.mp3      ZAOSTOCK by Iman Afrikah, the theme, 160 kbps
    badge.png         the ZAOstock 26 badge
    zao.jpg           the ZAO mark, used small as a crest
    img-stage.jpg     the stage last time out, behind the hero headline
    img-crowd.jpg     a ZAO room, last time out
    img-zaal.jpg      Zaal
```

The three photographs are web-sized derivatives of the originals in
`public/zao/`, kept next to the build so it stays self-contained.

`ops-room.html` is generated and git-ignored. `public/ops/index.html` and
`public/ops/assets/zaostock.mp3` are generated and committed, and
`src/lib/ops-room.test.ts` fails when the deployed copy is stale.

---

## Design

The app uses the site's own tokens from `src/app/globals.css`, verbatim:

- **Paper** `#F2E6D3` ground, `#FAF3E6` surfaces
- **Ink** `#241E15`
- **Red** `#D2402A` — as the stylesheet's own comment puts it, *red is the only
  thing that asks to be clicked*, so every button is red and nothing else is
- **Gold** `#E5AC3B` for now and live · **Denim** `#245078` for team surfaces ·
  **Olive** `#A4AF6E` for settled
- **Boogaloo** display, **Rubik** body, **Space Mono** for times and data
- Hard `3px 3px 0` poster shadows that collapse on press, pill buttons, and the
  same screen-print grain the site uses

The ZAO navy-and-gold mark appears small, as a crest. It is not the palette.

A night mode, built from the site's own denim tokens, is on the moon button for
working the board after dark.

---

## Facts the app is built on

From the organizing document, the 31 August standup and the **run of show
locked on 3 September**:

- Eight acts, outdoors, 12:05 to 17:46: The Crown Vics, OPEN X, Grass Rug,
  Acadia Rising, Michael Anderson, DCoop, Lyons Den, Fellenz (Hurricane out 2026-09-10). Street
  clears 18:00. WaveWarZ is cancelled and Stilo is not coming in person.
- The evening is Black Moon's afterparty, not ZAOstock's programme (Zaal,
  3 September). The board shows it as theirs and books nothing into it.
- The PA comes from OPEN X, who also play. There is no rental gate.
- There is no reveal day: an act publishes once confirmed in writing, with a
  bio and a photo. The artist details form has no due date (Zaal, 10 September).
- **Seven minutes between every act. If a set runs over it comes out of that
  act's own changeover; the next act still starts on time.**
- Black Moon covers bottled water and electricity, a $20 gift certificate for
  every performer, the basement dressing room and bathroom, and a porta-potty.
- No fire act. The City had approved one; Zaal dropped it on 11 September.
- Event insurance is quoted; talks with a local broker to get ZAO and the City
  on liability. This was the permit condition.
- Star 97.7 is a media partner: studio 10 September and 1 October, ads from
  around the 19th, a trade rather than cash.
- Friday 2 October soundcheck is mandatory for every act and goes in the
  contract.

The lineup switch on the Ops Board is **off by default**: the public schedule
shows times, venues and set lengths, and every act reads "to be announced" until
the crew flips it on reveal day.

---

## Known gaps, honestly

- **No artist photographs exist**, for any act. The three photographs in the app
  are the only real ones in the repo. This is tracked on the attention board.
- **The stream has no recorded destination**, no account and no operator, and
  the parklet internet has never been tested. Also on the board.
- **Twelve moderator seats, none claimed** at the time of writing.
- **Shared state only works inside the claude.ai artifact host.** Opened from
  zaostock.com/ops the page has no `window.claude`, so every save says "saved on
  this screen only" and the help queue, rota and lineup switch never leave the
  device. Where that state should live is the open question on this rewrite.
- Audio autoplay depends on browser policy. The page tries on load; if the
  browser refuses, the first click, keypress or scroll anywhere starts it and a
  "Tap for sound" button appears in the meantime.

---

From IMan.
