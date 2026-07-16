// Sends via Expo's push service (not APNs/FCM directly) - the mobile app
// registers an ExpoPushToken, and Expo's servers handle the actual APNs/FCM
// delivery. No credentials needed here; that's all configured on the EAS/
// Expo project side.
const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// Best-effort - a failed push should never fail the API call that
// triggered it (creating a todo, etc.). Errors are logged, not thrown.
export async function sendPushNotification(message: PushMessage): Promise<void> {
  try {
    const res = await fetch(EXPO_PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      console.error('[push] Expo push service returned', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('[push] Failed to send push notification', err);
  }
}
