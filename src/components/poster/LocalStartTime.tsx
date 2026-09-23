'use client';

import { useEffect, useState } from 'react';
import { FESTIVAL } from '@/content/festival';

// Server-rendered as null (the viewer's zone isn't known at build time), then
// filled in on the client. "Half the online crowd is not on Eastern" (Iman,
// 2026-09-23) - this converts noon ET into whatever clock the viewer actually
// reads, instead of asking them to do the math.
export function LocalStartTime({ className }: { className?: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const start = new Date(FESTIVAL.date);
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatted = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: start.getMinutes() === 0 ? undefined : '2-digit',
      timeZoneName: 'short',
    }).format(start);
    // Skip the line entirely for a viewer who happens to already be on
    // Eastern - the page already says "noon ET", repeating it as "12 PM ET"
    // a second time is noise, not help.
    setText(zone.includes('New_York') || zone.includes('Eastern') ? null : formatted);
  }, []);

  if (!text) return null;

  return (
    <p className={['text-sm text-ink-secondary m-0', className].filter(Boolean).join(' ')}>
      That&apos;s <span className="font-bold text-ink-950">{text}</span> in your time zone.
    </p>
  );
}
