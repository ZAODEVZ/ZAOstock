import Link from 'next/link';

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
  const mailto = `mailto:info@thezao.com?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="bg-[#0d1b2a] rounded-xl border border-[#f5a623]/30 p-6 space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
          This form is temporarily off
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          Our submissions database is down, and rather than show you a form that fails after you
          have filled it in, we have taken it off. Email works and reaches the same people.
        </p>
      </div>

      {include && include.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
            What to include
          </p>
          <ul className="text-sm text-gray-300 space-y-1">
            {include.map((i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gray-600 flex-shrink-0">-</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={mailto}
        className="inline-block bg-[#f5a623] text-[#0a1628] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#ffd700] transition-colors"
      >
        Email us to {action}
      </a>

      <p className="text-xs text-gray-500">
        info@thezao.com &middot; we read everything, and we will confirm we got it.
      </p>

      <div className="pt-1">
        <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623]">
          Back to ZAOstock
        </Link>
      </div>
    </div>
  );
}
