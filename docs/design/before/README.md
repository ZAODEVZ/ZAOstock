# Before-state, zaostock.com, 2026-08-27

What was captured, what was not, and exactly why.

## Screenshots: UNSET

Three renderers were pointed at the live site between 19:50 and 20:05 on
2026-08-27. None produced a rendered frame.

| Tool | Attempt | Result, verbatim |
|---|---|---|
| gstack browse (headless Chromium) | `goto https://zaostock.com` then `screenshot` | `Navigated to https://zaostock.com/ (200)` followed by `[browse] Starting server...` on every next command; `document.body.innerText.length` returned `0`. `goto https://example.com` in the same session worked (`Example Domain`). Setting a desktop user agent changed nothing. The server process dies after loading this site. |
| Playwright MCP | `browser_navigate` | `Extension connection timeout. Make sure the "Playwright MCP Bridge" extension is installed.` Not installed on this machine. |
| Claude in Chrome (the user's real Chrome) | `navigate`, `resize 1440x900`, `javascript_tool` | Navigation reported success, then `CDP sendCommand "Runtime.evaluate" timed out after 45000ms ... The renderer may be frozen or unresponsive.` A second try on `/program`: `Script injection timed out after 5000ms - the page is busy or mid-navigation`. `get_page_text`: `Page still loading (executeScript waited 45000ms for document_idle)`. |

`curl` returned `HTTP 200` for every route in 0.5-1.7s, so the server is fine.
A local `next dev` from this worktree could not stand in: Turbopack panics on
the worktree's `node_modules` symlink (`Symlink [project]/node_modules is
invalid, it points out of the filesystem root`) and the webpack fallback
returns 500 because the worktree has no Supabase env.

Two of the three failures happened inside real Chrome on the user's machine.
That is recorded as finding F-010 in the audit rather than explained away: a
site that keeps a renderer from reaching `document_idle` is a design problem,
and the redesign removes every continuous animation so it cannot recur.

## What was captured instead

The served HTML for thirteen routes, fetched with `curl` at 20:0x on 2026-08-27
and analysed for fonts, colours, headings, counts and fact strings. The raw
files stayed in the session scratchpad; the numbers are in
`design-review-2026-08-27.md` next to this file.

| Route | HTTP | Bytes | Words |
|---|---|---|---|
| `/` | 200 | 122,525 | 1,199 |
| `/program` | 200 | 26,282 | 256 |
| `/sponsor` | 200 | 53,298 | 695 |
| `/sponsor/deck` | 200 | 46,211 | 672 |
| `/pitch` | 200 | 103,057 | 1,067 |
| `/musicians` | 200 | 30,321 | 234 |
| `/artists` | 200 | 29,689 | 257 |
| `/apply` | 200 | 19,430 | 183 |
| `/donate` | 200 | 40,155 | 374 |
| `/festivals` | 200 | 33,625 | 306 |
| `/ellsworth` | 200 | 40,961 | 613 |
| `/onepagers/overview` | 200 | 59,157 | 624 |
| `/press` | **404** | 15,184 | 40 |

## To take the screenshots later

From any machine where Chrome can reach the site and settle:
`~/.claude/skills/gstack/browse/dist/browse goto https://zaostock.com && ... responsive docs/design/before/home`
for `/`, `/program`, `/sponsor`, `/musicians`, `/apply`, `/pitch` at 375, 768
and 1440. Name them `<route>-<width>.png` and drop them in this directory. The
audit's grades do not depend on them; the responsive category stays "not
measured" until they exist.
