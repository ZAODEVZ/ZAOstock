#!/usr/bin/env node
/**
 * What can the publishable key actually read?
 *
 * WHY THIS EXISTS
 *
 * The team dashboard is retired (src/lib/team-status.ts): every /api/team/*
 * route answers 401, the login routes answer 410, /team/m/<slug> is a 404. The
 * DATABASE is untouched by design. Every sponsor, budget line, artist,
 * volunteer, RSVP and note is still there, exactly as it was.
 *
 * Retired routes are not retired data. Whether any of it is reachable does not
 * depend on this repo at all: the site holds no publishable key, only the
 * service role key, server side (src/lib/db/supabase.ts). It depends on the
 * Supabase project's row level security, which lives in the dashboard, has no
 * migrations and no policy files here, and so is recorded nowhere. Nothing in
 * CI would notice a table left readable.
 *
 * This script is the missing check. It asks the question directly.
 *
 * WHAT IT EXPECTS
 *
 * Nothing readable. Not "nothing sensitive readable", nothing at all. No
 * browser, app or client in this codebase ever talks to Supabase directly, so
 * a publishable key has no legitimate read anywhere in this project, including
 * events and artists. Any table that returns a row is a finding.
 *
 * WHAT IT DOES NOT DO
 *
 * It never writes, and it never pulls a row. Every probe is a HEAD request
 * asking PostgREST for a count, so no field value is ever fetched, printed or
 * logged. The output is table names, statuses and row counts only.
 *
 * USAGE
 *
 *   node scripts/check-supabase-exposure.mjs
 *   npm run check:exposure
 *
 * Reads the project URL from NEXT_PUBLIC_SUPABASE_URL and the key from
 * SUPABASE_PUBLISHABLE_KEY, SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Both can be passed as arguments instead:
 *
 *   node scripts/check-supabase-exposure.mjs <project-url> <publishable-key>
 *
 * Exit codes: 0 nothing readable, 1 something readable, 2 could not run the
 * check at all. So it can become a scheduled job rather than something someone
 * remembers to do.
 */

/**
 * Every table this codebase touches, from `.from('...')` across src/.
 * `sensitive` marks the ones the retirement note names as the reason the rows
 * were kept: sponsors, budget, artists, volunteers, RSVPs, notes.
 */
const TABLES = [
  { name: 'sponsors', sensitive: true, holds: 'sponsor pipeline, contacts, amounts' },
  { name: 'budget_entries', sensitive: true, holds: 'money in and out' },
  { name: 'artists', sensitive: true, holds: 'fees, riders, notes, claim tokens' },
  { name: 'volunteers', sensitive: true, holds: 'names and contact details' },
  { name: 'rsvps', sensitive: true, holds: 'attendee names and contact details' },
  { name: 'meeting_notes', sensitive: true, holds: 'internal discussion' },
  { name: 'contact_log', sensitive: true, holds: 'who was approached and what was said' },
  { name: 'team_members', sensitive: true, holds: 'team identities and login material' },
  { name: 'comments', sensitive: true, holds: 'internal discussion' },
  { name: 'attachments', sensitive: true, holds: 'uploaded files' },
  { name: 'onepagers', sensitive: true, holds: 'unpublished positioning' },
  { name: 'suggestions', sensitive: false, holds: 'ideas box submissions' },
  { name: 'todos', sensitive: false, holds: 'internal task board' },
  { name: 'goals', sensitive: false, holds: 'internal targets' },
  { name: 'timeline', sensitive: false, holds: 'internal schedule' },
  { name: 'circles', sensitive: false, holds: 'team structure' },
  { name: 'circle_members', sensitive: false, holds: 'team structure' },
  { name: 'activity_log', sensitive: false, holds: 'who changed what' },
  { name: 'onepager_activity', sensitive: false, holds: 'who viewed what' },
  { name: 'events', sensitive: false, holds: 'the festival list, served publicly via our API' },
];

const url = (process.argv[2] || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
const key =
  process.argv[3] ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const pad = (s, n) => String(s).padEnd(n);
const out = (line = '') => console.log(line);
const err = (line = '') => console.error(line);

/**
 * Is the key itself accepted?
 *
 * Without this, a typo'd or revoked key answers 401 on every table and the run
 * reports a clean bill of health. That is exactly the silent success this whole
 * audit is about, so the script refuses to grade a key the project rejected.
 */
async function keyIsAccepted() {
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    return res.status !== 401 && res.status !== 403;
  } catch {
    return false;
  }
}

/** HEAD plus a count, so a readable table is detected without fetching a single value. */
async function probe(table) {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
      method: 'HEAD',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    });
    // PostgREST reports the count in Content-Range as "0-0/<total>".
    const total = (res.headers.get('content-range') || '').split('/')[1];
    const ok = res.status >= 200 && res.status < 300;
    const rows = total && total !== '*' ? Number(total) : null;
    // RLS enabled with no policy does NOT error on select: PostgREST answers 200
    // with zero rows. So a 200 carrying rows is real exposure, and a 200 carrying
    // none is either RLS doing its job or a genuinely empty table. From out here
    // those two are indistinguishable, so they are reported apart, not merged.
    return {
      readable: ok && rows !== null && rows > 0,
      reachableEmpty: ok && (rows === null || rows === 0),
      status: res.status,
      rows,
    };
  } catch (error) {
    return { readable: false, reachableEmpty: false, status: 0, rows: null, error: error.message };
  }
}

async function main() {
  if (!url) {
    err('No project URL. Set NEXT_PUBLIC_SUPABASE_URL or pass it as the first argument.');
    return 2;
  }
  if (!key) {
    err('No publishable key. Set SUPABASE_PUBLISHABLE_KEY or pass it as the second argument.');
    err('Supabase dashboard, Project Settings, API keys. Use the publishable/anon key.');
    err('Do NOT pass the service role key: it bypasses RLS and every table will read.');
    return 2;
  }
  if (/service_role/.test(key) || /^sb_secret_/.test(key)) {
    err('That looks like the SERVICE ROLE key. It bypasses row level security by design,');
    err('so every table would report readable and the run would tell you nothing.');
    err('Use the publishable/anon key instead.');
    return 2;
  }
  if (!(await keyIsAccepted())) {
    err('');
    err('That key was REJECTED by the project (401/403 on the REST root).');
    err('Every table would then report blocked, and the run would look clean when it is not.');
    err('Check the key, and that it belongs to this project, then run it again.');
    err('');
    return 2;
  }

  out('');
  out(`Project   ${url}`);
  out(`Key       publishable, ${key.slice(0, 6)}... (${key.length} chars)`);
  out(`Probing   ${TABLES.length} tables, HEAD only, no rows fetched`);
  out('');

  const results = [];
  for (const table of TABLES) {
    results.push({ ...table, ...(await probe(table.name)) });
  }

  // Worst first: readable and sensitive, then readable, then reached but empty,
  // then properly blocked.
  const rank = (r) => (r.readable ? (r.sensitive ? 0 : 1) : r.reachableEmpty ? 2 : 3);
  results.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));

  for (const r of results) {
    const mark = r.readable
      ? r.sensitive
        ? 'READABLE !!'
        : 'READABLE   '
      : r.reachableEmpty
        ? 'empty      '
        : 'blocked    ';
    const count = r.rows !== null ? `${r.rows} rows` : '';
    const note = r.readable
      ? r.holds
      : r.reachableEmpty
        ? 'reached it, got nothing: RLS with no policy, or an empty table'
        : `HTTP ${r.status}`;
    out(`  ${mark} ${pad(r.name, 20)} ${pad(count, 12)} ${note}`);
  }

  const exposed = results.filter((r) => r.readable);
  const ambiguous = results.filter((r) => r.reachableEmpty);
  const exposedSensitive = exposed.filter((r) => r.sensitive);
  const rowsExposed = exposed.reduce((n, r) => n + (r.rows ?? 0), 0);

  out('');

  if (exposed.length === 0) {
    out('No table returned a single row to this key.');
    if (ambiguous.length > 0) {
      out('');
      out(`${ambiguous.length} answered 200 with nothing in it:`);
      out(`  ${ambiguous.map((r) => r.name).join(', ')}`);
      out('That is RLS with no policy, or a genuinely empty table. From out here the');
      out('two look identical, so confirm in the dashboard that RLS is ON for those,');
      out('rather than reading this as an all-clear.');
    }
    out('');
    return 0;
  }

  out(`${exposed.length} of ${TABLES.length} tables readable with the publishable key.`);
  if (exposedSensitive.length > 0) {
    out(`${exposedSensitive.length} hold the rows the retirement note kept on purpose:`);
    out(`  ${exposedSensitive.map((r) => r.name).join(', ')}`);
  }
  out(`About ${rowsExposed} rows reachable by anyone holding this key.`);
  out('');
  out('Fix in the Supabase dashboard, per table: enable RLS, and add no policy.');
  out('RLS with no policy denies everything to the publishable key and changes');
  out('nothing for this site, which reads through the service role key server side.');
  out('');
  return 1;
}

// process.exit() while undici still holds a socket trips a libuv assertion on
// Windows, so the code is set and the process is left to end on its own.
process.exitCode = await main();
