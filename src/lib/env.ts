// Trim of ZAOOS ENV - only zaostock-relevant vars.
// Server-only: this object exposes SUPABASE_SERVICE_ROLE_KEY / SESSION_SECRET,
// so it must never be bundled into client code. Importing it from a client
// component is a build-time error.
import 'server-only';

function requiredServerEnv(key: 'SUPABASE_SERVICE_ROLE_KEY' | 'SESSION_SECRET'): string {
  const value = process.env[key];
  if (!value) {
    // Fail fast and loud the moment the value is actually read, not when this
    // module is merely imported - Next's build-time page-data collection
    // imports every route module without necessarily using every env var, so
    // throwing at object-construction time broke `next build` outright. A
    // missing secret must never silently fall through as an empty string
    // either - that risks a weak/predictable session secret or a DB client
    // that fails cryptically deep in an unrelated code path.
    throw new Error(`[env] ${key} is required and not set - add it to .env.local (or the deployment's env vars)`);
  }
  return value;
}

export const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://zaostock.com',
} as {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SESSION_SECRET: string;
};

Object.defineProperty(ENV, 'SUPABASE_SERVICE_ROLE_KEY', {
  enumerable: true,
  get: () => requiredServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
});
Object.defineProperty(ENV, 'SESSION_SECRET', {
  enumerable: true,
  get: () => requiredServerEnv('SESSION_SECRET'),
});

if (typeof window === 'undefined' && !ENV.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('[env] NEXT_PUBLIC_SUPABASE_URL is empty - set it in .env.local');
}
