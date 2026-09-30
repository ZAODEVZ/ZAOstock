# Self-hosted fonts

Boogaloo, Oswald, Rubik and Space Mono: Latin subset, woff2, downloaded from
Google Fonts on 2026-09-30. All four are under the SIL Open Font License 1.1.

Why they live here: `next/font/google` fetched them from Google on every build,
and that fetch failed three times on 30 Sep 2026, turning main red. A red main
on festival day would block a hotfix. Rubik and Oswald are variable fonts, so
one file covers every weight used.
