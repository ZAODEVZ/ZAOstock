import { googleCalendarHref, icsDataHref } from '@/lib/calendar';
import { BUTTON_BASE, BUTTON_VARIANT, BUTTON_SIZE } from './primitives';

// Pure server-rendered links - no client JS needed, both hrefs are computed
// from FESTIVAL.date at render time (src/lib/calendar.ts).
//
// The .ics link is NOT run through <Button>: it needs a `download` attribute
// so the browser saves the file instead of opening the raw ICS text in a new
// tab (Button's `external` path only ever renders target="_blank", no way to
// pass `download` through).
export function AddToCalendar({ className }: { className?: string }) {
  const btnClass = [BUTTON_BASE, BUTTON_VARIANT.secondary, BUTTON_SIZE.sm].join(' ');
  return (
    <div className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}>
      <a href={googleCalendarHref()} target="_blank" rel="noopener noreferrer" className={btnClass}>
        Add to Google Calendar
      </a>
      <a href={icsDataHref()} download="zaostock-2026.ics" className={btnClass}>
        Download .ics
      </a>
    </div>
  );
}
