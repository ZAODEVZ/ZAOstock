import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PRESS, ARTIST_EMBEDS, MEDIA_ACTS, NO_SOCIALS } from './media';

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

  it('is in the sitemap and the footer', () => {
    expect(read('src/app/sitemap.ts')).toContain("'/media'");
    expect(read('src/components/poster/Footer.tsx')).toContain("'/media'");
  });
});
