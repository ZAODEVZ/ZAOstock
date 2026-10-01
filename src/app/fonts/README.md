# Self-hosted fonts

Boogaloo, Oswald, Rubik and Space Mono: Latin subset, woff2, downloaded from
Google Fonts on 2026-09-30. All four are under the SIL Open Font License 1.1
(copyright lines as in google/fonts ofl/*/OFL.txt):

- Boogaloo: Copyright (c) 2011, John Vargas Beltrán, with Reserved Font Name Boogaloo.
- Oswald: Copyright 2016 The Oswald Project Authors (https://github.com/googlefonts/OswaldFont)
- Rubik: Copyright 2015 The Rubik Project Authors (https://github.com/googlefonts/rubik)
- Space Mono: Copyright 2016 The Space Mono Project Authors (https://github.com/googlefonts/spacemono)

Why they live here: `next/font/google` fetched them from Google on every build,
and that fetch failed three times on 30 Sep 2026, turning main red. A red main
on festival day would block a hotfix. Rubik and Oswald are variable fonts, so
one file covers every weight used.
