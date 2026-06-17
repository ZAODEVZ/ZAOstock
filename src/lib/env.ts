// Trim of ZAOOS ENV - only zaostock-relevant vars.

export const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  SESSION_SECRET: process.env.SESSION_SECRET ?? '',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://zaostock.com',
} as const;

if (typeof window === 'undefined') {
  for (const k of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SESSION_SECRET'] as const) {
    if (!ENV[k]) console.warn(`[env] ${k} is empty - set it in .env.local`);
  }
}
