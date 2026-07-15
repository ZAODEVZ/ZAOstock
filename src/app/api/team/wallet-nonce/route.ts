import { NextRequest, NextResponse } from 'next/server';
import { issueNonce } from '@/lib/auth/wallet-nonce';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

// No auth required - a nonce alone is useless without a matching signature,
// and it's single-use/short-lived (see wallet-nonce.ts). Rate limited the
// same as every other public form endpoint to raise the bar against someone
// farming nonces for no real reason.
export async function GET(request: NextRequest) {
  const limited = rateLimitPublicForm(request, 'team-wallet-nonce', { windowMs: 60_000, maxAttempts: 20 });
  if (limited) return limited;

  return NextResponse.json({ nonce: issueNonce() });
}
