import { ImageResponse } from 'next/og';

// Dedicated, branded ZAOstock social card. Generated at the root so every
// route inherits it (unless a page sets its own openGraph.images).
export const alt = 'ZAOstock 2026 - a one-day artist-built music festival in Ellsworth, Maine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#0a1628';
const FG = '#e2e8f0';
const ACCENT = '#f5a623';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          backgroundImage: `radial-gradient(circle at 80% 0%, rgba(245,166,35,0.18), transparent 45%)`,
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 16,
              background: ACCENT,
              color: BG,
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            Z
          </div>
          <div style={{ color: FG, fontSize: 30, letterSpacing: 2, opacity: 0.85 }}>
            THE ZAO
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 132, fontWeight: 700, color: FG, lineHeight: 1 }}>
            ZAO<span style={{ color: ACCENT }}>stock</span>
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 40, color: FG, opacity: 0.9 }}>
            A one-day artist-built music festival
          </div>
        </div>

        {/* Footer details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 32, color: ACCENT }}>
          <span style={{ display: 'flex' }}>October 3, 2026</span>
          <span style={{ display: 'flex', color: FG, opacity: 0.5 }}>·</span>
          <span style={{ display: 'flex', color: FG, opacity: 0.9 }}>Downtown Ellsworth, Maine</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
