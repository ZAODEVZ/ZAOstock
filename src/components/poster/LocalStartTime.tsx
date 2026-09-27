'use client';

import { useState } from 'react';
import { FESTIVAL } from '@/content/festival';

const START = new Date(FESTIVAL.date);

function timeFormatOptions(): Intl.DateTimeFormatOptions {
  return {
    hour: 'numeric',
    minute: START.getMinutes() === 0 ? undefined : '2-digit',
    timeZoneName: 'short',
  };
}

export function formatInZone(zone: string): string {
  return new Intl.DateTimeFormat(undefined, { ...timeFormatOptions(), timeZone: zone }).format(START);
}

// A viewer is "already on Eastern" when the festival instant formats
// identically in their zone and in America/New_York - not when their IANA
// zone name merely contains "New_York" or "Eastern". America/Toronto,
// America/Detroit, America/Kentucky/Louisville and
// America/Indiana/Indianapolis are all Eastern time but match neither
// substring, so a name-based check wrongly shows them the redundant line.
export function localStartTimeText(zone: string): string | null {
  const local = formatInZone(zone);
  const eastern = formatInZone('America/New_York');
  // Skip the line entirely for a viewer who happens to already be on
  // Eastern - the page already says "noon ET", repeating it as "12 PM ET"
  // a second time is noise, not help.
  return local === eastern ? null : local;
}

// Server-rendered as null (the viewer's zone isn't known at build time), then
// filled in on the client. "Half the online crowd is not on Eastern" (Iman,
// 2026-09-23) - this converts noon ET into whatever clock the viewer actually
// reads, instead of asking them to do the math.
export function LocalStartTime({ className }: { className?: string }) {
  const [text] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return localStartTimeText(zone);
  });

  if (!text) return null;

  return (
    <p className={['text-sm text-ink-secondary m-0', className].filter(Boolean).join(' ')}>
      That&apos;s <span className="font-bold text-ink-950">{text}</span> in your time zone.
    </p>
  );
}
