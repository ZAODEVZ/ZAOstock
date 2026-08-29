#!/usr/bin/env node
// scripts/team-codes.mjs
//
// Manage ZAOstock /team 4-letter login codes without touching the DB.
//
//   npm run codes                     alias for `list`
//   npm run codes list                show every member + their expected 4-letter code
//   npm run codes test                POST each expected code to /api/team/login (dev or prod)
//   npm run codes verify [file]       test the actual codes you keep in scripts/team-codes.local.json
//   npm run codes reset DCoop         print SQL to reset ONE member to a fresh RANDOM code
//   npm run codes rotate              print SQL that moves EVERY member to a fresh random code, and
//                                     write the new codes to scripts/team-codes.local.json (gitignored)
//
// Why each subcommand exists:
//   - codes are scrypt-hashed in DB so we can't read them back
//   - the deterministic formula is `name.replace(/\s+/g, '').slice(0,4).toUpperCase()`
//   - random-codes script overwrote some members; this tool puts a single member
//     back on the formula without touching anyone else
//   - `test` proves which currently-deployed codes work end-to-end via the login API
//
// Env:
//   TEAM_CODES_BASE   override the API base URL for `test` (default http://localhost:3000)

import { scryptSync, randomBytes } from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Source of truth: ZAO STOCK Supabase team_members table (27 rows incl. ZAOstock Bot).
// Last synced 2026-05-05. Roster rebuilt around the 6-circle structure
// (finance, host, livestream, marketing, music, ops). Active flag is the
// dashboard gate; this list is who the static codes script can mint for.
const TEAM = [
  // ops (9 members + Zaal)
  { name: 'Zaal',           role: 'lead',   scope: 'ops' },
  { name: 'Candy',          role: '2nd',    scope: 'ops' },
  { name: 'FailOften',      role: 'member', scope: 'ops' },
  { name: 'Hurric4n3Ike',   role: 'member', scope: 'ops' },
  { name: 'Swarthy Hatter', role: 'member', scope: 'ops' },
  { name: 'Jango',          role: 'member', scope: 'ops' },
  { name: 'Adam',           role: 'member', scope: 'ops' },
  { name: 'Bacon',          role: 'member', scope: 'ops' },
  { name: 'Cheeka',         role: 'member', scope: 'ops' },
  { name: 'Eduard',         role: 'member', scope: 'ops' },
  { name: 'Eve',            role: 'member', scope: 'ops' },
  { name: 'GeekMyth',       role: 'member', scope: 'ops' },
  { name: 'Jake',           role: 'member', scope: 'ops' },
  // music (6)
  { name: 'DCoop',          role: '2nd',    scope: 'music' },
  { name: 'AttaBotty',      role: 'member', scope: 'music' },
  { name: 'Shawn',          role: 'member', scope: 'music' },
  // livestream (Thy Revolution leads after May 4 cobuild)
  { name: 'Thy Revolution', role: 'lead',   scope: 'livestream' },
  // finance team (sponsor + budget side)
  { name: 'Tyler Stambaugh',role: 'advisory', scope: 'finance' },
  { name: 'Ohnahji B',      role: 'member', scope: 'finance' },
  { name: 'DFresh',         role: 'member', scope: 'finance' },
  { name: 'Craig G',        role: 'advisory', scope: 'finance' },
  { name: 'Maceo',          role: 'member', scope: 'finance' },
  // design lead (DaNici inactive in DB, kept for code generation)
  { name: 'DaNici',         role: 'lead',   scope: 'design' },
  // unaffiliated (no scope yet, advisory + community)
  { name: 'Iman Afrikah',   role: 'member', scope: '' },
  { name: 'Stilo World',    role: 'member', scope: '' },
  { name: 'Tom Fellenz',    role: 'advisory', scope: '' },
];

function deterministicCode(name) {
  return name.replace(/\s+/g, '').slice(0, 4).toUpperCase();
}

// unambiguous alphabet - no 0/O/1/I/L
const RANDOM_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function randomCode() {
  let c = '';
  for (let i = 0; i < 4; i++) c += RANDOM_ALPHABET[randomBytes(1)[0] % RANDOM_ALPHABET.length];
  return c;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function pad(s, n) {
  return String(s).padEnd(n, ' ');
}

function listCmd() {
  const seen = new Set();
  const collisions = [];

  console.log('\nZAOstock team - deterministic 4-letter codes');
  console.log('=============================================');
  console.log(`${pad('NAME', 20)} ${pad('SCOPE', 10)} ${pad('ROLE', 8)} CODE`);
  console.log(`${'-'.repeat(20)} ${'-'.repeat(10)} ${'-'.repeat(8)} ----`);

  for (const m of TEAM) {
    const code = deterministicCode(m.name);
    if (seen.has(code)) collisions.push({ name: m.name, code });
    seen.add(code);
    console.log(`${pad(m.name, 20)} ${pad(m.scope, 10)} ${pad(m.role, 8)} ${code}`);
  }

  if (collisions.length) {
    console.log('\nCOLLISION (two members share same 4-letter code):');
    for (const c of collisions) console.log(`  - ${c.name} -> ${c.code}`);
  }
  console.log('');
}

async function testCmd() {
  const base = process.env.TEAM_CODES_BASE || 'http://localhost:3000';
  console.log(`\nTesting each deterministic code against ${base}/api/team/login`);
  console.log('============================================================');

  let pass = 0, fail = 0;
  for (const m of TEAM) {
    const code = deterministicCode(m.name);
    try {
      const res = await fetch(`${base}/api/team/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: code }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && data?.success === true;
      const matchedName = data?.name;
      const status = ok
        ? (matchedName === m.name ? 'PASS' : `WRONG-NAME (matched ${matchedName})`)
        : `FAIL (${res.status})`;
      console.log(`${pad(m.name, 20)} -> ${pad(code, 5)} ${status}`);
      if (ok) pass++; else fail++;
    } catch (e) {
      console.log(`${pad(m.name, 20)} -> ${pad(code, 5)} ERROR (${e.message})`);
      fail++;
    }
  }
  console.log(`\n${pass} pass / ${fail} fail`);
  if (fail > 0) {
    console.log('\nFor any FAIL: run `npm run codes reset <Name>` to print SQL that fixes that one row.');
  }
  console.log('');
}

function resetCmd(rawName, { mode = 'random' } = {}) {
  if (!rawName) {
    console.error('Usage: npm run codes reset <Name> [--deterministic]');
    process.exit(1);
  }
  const member = TEAM.find(
    (m) => m.name.toLowerCase() === rawName.toLowerCase() || m.name.replace(/\s+/g, '').toLowerCase() === rawName.toLowerCase(),
  );
  if (!member) {
    console.error(`Unknown team member: "${rawName}"`);
    console.error('Known names: ' + TEAM.map((m) => m.name).join(', '));
    process.exit(1);
  }

  const code = mode === 'deterministic' ? deterministicCode(member.name) : randomCode();
  const passwordHash = hashPassword(code);

  console.log(`\nReset SQL for ${member.name} (paste into Supabase SQL Editor)`);
  console.log('================================================================');
  console.log(`-- Sets ${member.name}'s 4-letter login code to "${code}" (${mode})`);
  console.log(`-- Generated ${new Date().toISOString()}`);
  console.log(`-- Codes are case-insensitive at login (always uppercased before hash check).\n`);
  console.log(`UPDATE team_members`);
  console.log(`SET password_hash = '${passwordHash}',`);
  console.log(`    active = true`);
  console.log(`WHERE name = '${member.name.replace(/'/g, "''")}';\n`);
  console.log(`-- After running:`);
  console.log(`--   1) Confirm 1 row updated.`);
  console.log(`--   2) DM ${member.name} the code: ${code}`);
  console.log(`--   3) Update scripts/team-codes.local.json so verify keeps passing.\n`);
}

// Rotate every code at once. Codes were minted from a formula that lives in
// this public repo (name -> first four letters), so anyone who can read a name
// can guess a code. `rotate` prints ONE SQL script for the Supabase SQL editor
// that gives every member a fresh random code, and writes name -> code to the
// gitignored local file so `verify` keeps working. The codes are shown once,
// here and in that file; send each person theirs privately.
function rotateCmd() {
  const rows = TEAM.map((m) => ({ name: m.name, code: randomCode() }));
  const stamp = new Date().toISOString();
  console.log(`-- ZAOstock team codes: full rotation, generated ${stamp}`);
  console.log(`-- Paste the whole block into the Supabase SQL editor on the REAL project`);
  console.log(`-- (yjrlaxpjusmrfylumban). Expect one "UPDATE 1" per member; a 0 means the`);
  console.log(`-- name in team_members differs from the roster below - fix with reset <Name>.`);
  console.log(`-- Codes are case-insensitive at login (uppercased before the hash check).\n`);
  for (const r of rows) {
    console.log(`UPDATE team_members SET password_hash = '${hashPassword(r.code)}' WHERE name = '${r.name.replace(/'/g, "''")}';`);
  }
  const out = resolve('scripts/team-codes.local.json');
  const local = {};
  for (const r of rows) local[r.name] = r.code;
  writeFileSync(out, JSON.stringify(local, null, 2) + '\n');
  console.log(`\n-- New codes written to ${out} (gitignored). Send each person theirs privately, then run: npm run codes verify`);
  console.log(`-- Members in the database but not in this roster keep their OLD code until you run: npm run codes reset <Name>`);
}

async function verifyCmd(filePath) {
  const path = resolve(filePath || 'scripts/team-codes.local.json');
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    console.error(`\nNo codes file at ${path}.`);
    console.error('Create scripts/team-codes.local.json with shape:');
    console.error('  { "DCoop": "DCOO", "Zaal": "ZAAL", ... }');
    console.error('(file is gitignored - safe to keep plaintext)\n');
    process.exit(1);
  }

  let codeMap;
  try {
    codeMap = JSON.parse(raw);
  } catch (e) {
    console.error(`\nFile is not valid JSON: ${e.message}\n`);
    process.exit(1);
  }

  const base = process.env.TEAM_CODES_BASE || 'https://zaostock.com';
  console.log(`\nVerifying ${Object.keys(codeMap).length} codes from ${path}`);
  console.log(`Against: ${base}/api/team/login`);
  console.log('============================================================');

  let pass = 0, fail = 0;
  for (const [name, code] of Object.entries(codeMap)) {
    try {
      const res = await fetch(`${base}/api/team/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: String(code) }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && data?.success === true;
      const matched = data?.name;
      const status = ok
        ? (matched === name ? 'PASS' : `WRONG-NAME (matched ${matched})`)
        : `FAIL (${res.status})`;
      console.log(`${pad(name, 20)} -> ${pad(String(code), 5)} ${status}`);
      if (ok && matched === name) pass++; else fail++;
    } catch (e) {
      console.log(`${pad(name, 20)} -> ${pad(String(code), 5)} ERROR (${e.message})`);
      fail++;
    }
  }
  console.log(`\n${pass} pass / ${fail} fail`);
  if (fail > 0) {
    console.log('\nFor any FAIL: paste the reset SQL from `npm run codes reset <Name>` into Supabase + update your local JSON.');
  }
  console.log('');
}

const [, , cmd = 'list', ...rest] = process.argv;

switch (cmd) {
  case 'list':
    listCmd();
    break;
  case 'test':
    await testCmd();
    break;
  case 'verify':
    await verifyCmd(rest[0]);
    break;
  case 'rotate':
    rotateCmd();
    break;
  case 'reset': {
    const args = rest.filter((a) => !a.startsWith('--'));
    const flags = rest.filter((a) => a.startsWith('--'));
    const mode = flags.includes('--deterministic') ? 'deterministic' : 'random';
    resetCmd(args.join(' ').trim(), { mode });
    break;
  }
  default:
    console.error(`Unknown command: ${cmd}`);
    console.error('Usage: npm run codes [list|test|verify <file>|reset <Name>|rotate]');
    process.exit(1);
}
