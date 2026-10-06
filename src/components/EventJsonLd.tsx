import { eventJsonLd } from '@/content/event-jsonld';

// The ZAOstock 2026 MusicEvent, rendered only on the pages about the festival
// (home, /program, /live, /artist/[slug]). Until 2026-10-06 it sat in the root
// layout, so every page claimed to be the festival, including /zaoville (the
// July Maryland event) and /privacy. SEO handoff 2026-09-29 (card 10180) asked
// for it to be scoped after the festival. `<` is escaped so no string in the
// data can close the script tag.
export function EventJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
