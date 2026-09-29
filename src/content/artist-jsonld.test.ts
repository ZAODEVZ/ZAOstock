import { describe, it, expect } from 'vitest';
import { artistJsonLd, artistJsonLdString } from './artist-jsonld';
import { FESTIVAL } from './festival';

const BASE = { name: 'OPEN X', slug: 'open-x', bio: 'A rock band.', photo_url: 'https://example.com/p.webp', socials: '' };

describe('artistJsonLd', () => {
  it('names the act and ties it to ZAOstock on the festival date and venue', () => {
    const ld = artistJsonLd(BASE);
    expect(ld['@type']).toBe('MusicGroup');
    expect(ld.name).toBe('OPEN X');
    expect(ld.url).toBe('https://zaostock.com/artist/open-x');
    expect(ld.event.startDate).toBe(FESTIVAL.date);
    expect(ld.event.location.name).toBe(FESTIVAL.venue);
    expect(ld.event.location.address.addressLocality).toBe('Ellsworth');
  });

  it('uses the display name Zaal ruled public, keeping the identity slug', () => {
    const ld = artistJsonLd({ ...BASE, name: 'LyonsDen', slug: 'lyonsden' });
    expect(ld.name).toBe('LyonsDen Rez Muzik');
    expect(ld.url).toBe('https://zaostock.com/artist/lyonsden');
  });

  it('lists only real URLs as sameAs, never a bare handle', () => {
    const ld = artistJsonLd({ ...BASE, socials: '@openx https://instagram.com/openx bandcamp.com/openx' });
    expect(ld.sameAs).toEqual(['https://instagram.com/openx', 'https://bandcamp.com/openx']);
  });

  it('omits fields the act has not filled in rather than publishing empties', () => {
    const ld = artistJsonLd({ ...BASE, bio: '  ', photo_url: '' });
    expect(ld).not.toHaveProperty('description');
    expect(ld).not.toHaveProperty('image');
    expect(ld).not.toHaveProperty('sameAs');
  });

  it('cannot be closed early by a bio containing </script>', () => {
    const s = artistJsonLdString({ ...BASE, bio: 'x</script><script>alert(1)</script>' });
    expect(s).not.toContain('</script>');
    expect(JSON.parse(s).description).toContain('</script>');
  });
});

describe('the artist page emits it', () => {
  it('page.tsx renders artistJsonLdString(artist) in a ld+json script', async () => {
    const { readFileSync } = await import('node:fs');
    const path = await import('node:path');
    const page = readFileSync(path.join(process.cwd(), 'src/app/artist/[slug]/page.tsx'), 'utf8');
    expect(page).toContain('type="application/ld+json"');
    expect(page).toContain('artistJsonLdString(artist)');
  });
});
