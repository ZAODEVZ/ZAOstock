import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The moose on ink, beside the wordmark on paper, at 1200x630, per docs/design/redesign-2026-08-28.md. Every
// route inherits it unless a page sets its own openGraph.images. Rendered once
// at build; the mono badge (86 KB) keeps the response small.
export const alt = 'ZAOstock 2026: a free, one-day, artist-built music festival in Ellsworth, Maine. Saturday 3 October 2026.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#F2E6D3';
const CARD = '#FAF3E6';
const INK = '#241E15';
const GOLD = '#A8721C';
const DENIM = '#2E6494';

export default async function OpengraphImage() {
  // The moose, the primary mark since 2026-09-10. White knockout, so it sits on
  // ink. The 600px copy keeps the inlined image small.
  const logo = await readFile(path.join(process.cwd(), 'public', 'brand', 'logos', 'zaostock26_moose_600.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: PAPER,
          padding: '56px 72px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: INK,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 680 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: DENIM }}>
            Community music festival · Ellsworth, Maine
          </div>
          <div style={{ display: 'flex', fontSize: 132, fontWeight: 800, lineHeight: 1, marginTop: 18, letterSpacing: -3 }}>
            <span style={{ color: INK }}>ZAO</span>
            <span style={{ color: GOLD }}>stock</span>
          </div>
          <div style={{ fontSize: 30, marginTop: 22, lineHeight: 1.3, color: '#625A4E' }}>
            A free, one-day, artist-built music festival on Franklin Street, downtown Ellsworth, Maine.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
            {['Sat 3 Oct 2026', 'Franklin St Parklet', 'Music from noon', 'Free'].map((t) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  padding: '8px 14px',
                  border: `2px solid ${INK}`,
                  borderRadius: 999,
                  background: CARD,
                  fontSize: 17,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: 360,
            height: 360,
            borderRadius: 18,
            border: `3px solid ${INK}`,
            boxShadow: `8px 8px 0 ${INK}`,
            background: INK,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- satori needs a plain img */}
          <img src={logoSrc} alt="" width={320} height={320} style={{ objectFit: 'contain' }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
