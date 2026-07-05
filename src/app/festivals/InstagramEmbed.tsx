'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface InstagramEmbedProps {
  /** Full Instagram permalink, e.g. https://www.instagram.com/reel/DDa-oPBJ7G7/ */
  urls: string[];
}

/**
 * Renders Instagram posts/reels inline via the official embed.js.
 * Loads the script once, then reprocesses whenever the url list changes.
 */
export function InstagramEmbed({ urls }: InstagramEmbedProps) {
  useEffect(() => {
    const SRC = 'https://www.instagram.com/embed.js';
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (existing) {
      window.instgrm?.Embeds.process();
      return;
    }
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(s);
  }, [urls]);

  return (
    <div className="flex flex-col items-center gap-4">
      {urls.map((url) => (
        <blockquote
          key={url}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ background: '#0a1628', border: 0, margin: 0, maxWidth: 540, width: '100%' }}
        />
      ))}
    </div>
  );
}
