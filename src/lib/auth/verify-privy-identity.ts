import 'server-only';
import { verifyIdentityToken } from '@privy-io/node';
import { ENV } from '@/lib/env';

// Deliberately uses the standalone verifyIdentityToken() function with just
// the JWT verification key, not the full PrivyClient(appId, appSecret) - the
// verification key is a narrower-scoped credential (can only verify tokens
// signed by this app) than the App Secret (grants full API access: wallet
// management, sending transactions, etc.). This app only ever needs to
// verify who someone is, never to act as them or manage their wallet.
export async function verifyPrivyIdentityEmail(identityToken: string): Promise<string | null> {
  const user = await verifyIdentityToken({
    identity_token: identityToken,
    app_id: ENV.PRIVY_APP_ID,
    verification_key: ENV.PRIVY_VERIFICATION_KEY,
  });

  const emailAccount = user.linked_accounts.find(
    (account): account is Extract<typeof account, { type: 'email' }> => account.type === 'email',
  );

  return emailAccount ? emailAccount.address.toLowerCase() : null;
}
