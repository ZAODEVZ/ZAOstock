import { FESTIVAL } from '@/content/festival';

// Add-to-calendar links for the festival window, built from FESTIVAL.date
// (2026-10-03T12:00:00-04:00) so a change to that one value keeps every
// caller correct. No library, no server route - both formats are pure URL
// construction, safe to compute at render time.

/** FESTIVAL.date plus the six-hour outdoor window (matches src/lib/countdown.ts). */
function eventBounds() {
  const start = new Date(FESTIVAL.date);
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
  return { start, end };
}

/** UTC, no punctuation, no milliseconds - the one timestamp shape both Google's URL API and the ICS spec accept. */
function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

const TITLE = 'ZAOstock 2026';
const DESCRIPTION = `${FESTIVAL.venue}, ${FESTIVAL.city}. Free to attend, all ages. zaostock.com`;
const LOCATION = `${FESTIVAL.venue}, ${FESTIVAL.city}`;

export function googleCalendarHref(): string {
  const { start, end } = eventBounds();
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: DESCRIPTION,
    location: LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** A data: URI .ics download - works for Apple/Outlook/anything else without a server route. */
export function icsDataHref(): string {
  const { start, end } = eventBounds();
  const now = stamp(new Date());
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZAOstock//zaostock.com//EN',
    'BEGIN:VEVENT',
    `UID:zaostock-2026@zaostock.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DESCRIPTION}`,
    `LOCATION:${LOCATION}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
