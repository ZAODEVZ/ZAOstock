import 'server-only';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { consumeNonce } from './wallet-nonce';

const publicClient = createPublicClient({ chain: base, transport: http() });

interface WalletProof {
  address: string;
  message: string;
  signature: string;
}

// Verifies a wallet-connect login/link proof: the message must contain a
// nonce this server actually issued (and not already used - consumeNonce is
// single-use), and the signature must be valid for the claimed address on
// Base. Using publicClient.verifyMessage() rather than a bare ecrecover
// covers both plain EOA wallets and ERC-1271 smart-contract wallets (Safe,
// etc.) - the latter needs the RPC call, the former doesn't, but the same
// call handles both correctly.
export async function verifyWalletProof({ address, message, signature }: WalletProof): Promise<boolean> {
  const nonceMatch = message.match(/Nonce: ([a-f0-9]{32})/);
  if (!nonceMatch) return false;
  if (!consumeNonce(nonceMatch[1])) return false;

  if (!message.includes(`Address: ${address}`)) return false;

  try {
    return await publicClient.verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });
  } catch {
    return false;
  }
}
