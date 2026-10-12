import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PRESS, ARTIST_EMBEDS, MEDIA_ACTS, NO_SOCIALS, RADIO, NEWSLETTER } from './media';
import { existsSync } from 'node:fs';
import { ZAO_MEDIA } from './zao-media';

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('/media content', () => {
  it('lists press over https, with a real date and our own summary', () => {
    expect(PRESS.length).toBeGreaterThan(0);
    for (const p of PRESS) {
      expect(p.url).toMatch(/^https:\/\//);
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it('keys embeds by an act on the bill, YouTube ids only', () => {
    for (const [name, items] of Object.entries(ARTIST_EMBEDS)) {
      expect(MEDIA_ACTS).toContain(name);
      for (const e of items) expect(e.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
    }
  });

  it('plays YouTube only through the no-cookie host, and the CSP allows it', () => {
    const page = read('src/app/media/page.tsx');
    expect(page).toContain('https://www.youtube-nocookie.com/embed/');
    expect(page).not.toMatch(/https:\/\/www\.youtube\.com\/embed/);
    expect(read('next.config.ts')).toContain('https://www.youtube-nocookie.com');
  });

  it('records a confirmed "no socials" act by its bill name', () => {
    for (const name of NO_SOCIALS) expect(MEDIA_ACTS).toContain(name);
    expect(read('src/app/media/page.tsx')).toContain('NO_SOCIALS.includes(name)');
  });

  it('plays radio files that ship in public/', () => {
    expect(RADIO.length).toBeGreaterThan(0);
    for (const r of RADIO) expect(existsSync(path.join(process.cwd(), 'public', r.src)), r.src).toBe(true);
  });

  it('lists newsletter editions newest first, all on The ZAO publication', () => {
    const dates = NEWSLETTER.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    for (const e of NEWSLETTER) expect(e.url).toMatch(/^https:\/\/paragraph\.com\/@thezao\/year-of-the-zabal-day-\d/);
  });

  it('includes every edition an artist page links, so /media is the full set', () => {
    const all = new Set(NEWSLETTER.map((e) => e.url));
    for (const items of Object.values(ZAO_MEDIA)) for (const m of items) expect(all.has(m.url), m.url).toBe(true);
  });

  it('is in the sitemap and the footer', () => {
    expect(read('src/app/sitemap.ts')).toContain("'/media'");
    expect(read('src/components/poster/Footer.tsx')).toContain("'/media'");
  });
});
