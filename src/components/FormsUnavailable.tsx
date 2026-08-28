import Link from 'next/link';
import { SITE } from '@/content/site';

// The public submission forms write to Supabase. When that write path is
// unavailable the forms return "Could not submit right now" AND DISCARD the
// submission entirely - the person's answers are gone, and we never learn they
// tried. On 2026-08-23 an artist referred by Heart of Ellsworth hit exactly
// that, and only got through because they had Zaal's personal email and typed
// the whole thing out again by hand. Others will not do that.
//
// So while the write path is down the forms come off and this takes their
// place: an honest explanation and a route that actually works.
//
// TO PUT THE FORMS BACK: set PUBLIC_FORMS_ENABLED back to true in
// src/lib/forms-status.ts. One constant, nothing else. Do not delete the form
// components - they are fine, the database underneath them was not.

interface FormsUnavailableProps {
  /** What the person was trying to do, e.g. "submit your music". */
  action: string;
  /** Prefilled email subject so replies are sortable. */
  subject: string;
  /** Optional list of what to include, so email is not a worse form. */
  include?: string[];
}

export function FormsUnavailable({ action, subject, include }: FormsUnavailableProps) {
  const mailto = `mailto:${SITE.contact}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="zs-alert zs-alert--warning">
      <p className="font-mono text-eyebrow font-bold uppercase tracking-[0.12em] m-0">This form is temporarily off</p>
      <p className="text-sm m-0 measure">
        Our submissions database is down, and rather than show you a form that fails after you have filled it in, we have taken it off. Email works and reaches the same people.
      </p>

      {include && include.length > 0 && (
        <div className="mt-1">
          <p className="font-mono text-eyebrow font-bold uppercase tracking-[0.12em] m-0 mb-1.5">What to include</p>
          <ul className="text-sm m-0 pl-5 list-disc">
            {include.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2">
        <a href={mailto} className="zs-btn zs-btn--primary">
          Email us to {action}
        </a>
      </div>

      <p className="text-sm m-0">{SITE.contact} &middot; we read everything, and we will confirm we got it.</p>
      <Link href="/" className="text-sm font-semibold underline underline-offset-4 text-ink-950">
        Back to ZAOstock
      </Link>
    </div>
  );
}
