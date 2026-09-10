import { NextResponse } from 'next/server';

// WHICH COMMIT IS THIS DEPLOYMENT BUILT FROM. Read from the thing itself.
//
// 2026-09-10: #156 merged as 006aab9 and deployed "success" at 12:05:00; #155,
// one commit BEHIND it (92c4aad), finished at 12:06:11 and was promoted over
// it. GitHub said merged, Vercel said success twice, and production served the
// older build for minutes while every page check read the old copy. The
// deployment records were each true and together misleading.
//
// So the checks ask the site. Vercel sets VERCEL_GIT_COMMIT_SHA at build time;
// force-static bakes it into this deployment's own output, so the answer is
// the build that is actually serving, not whichever record is newest.
// Public and harmless: a commit SHA in a public repository.
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(
    {
      sha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      ref: process.env.VERCEL_GIT_COMMIT_REF || null,
      env: process.env.VERCEL_ENV || null,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
