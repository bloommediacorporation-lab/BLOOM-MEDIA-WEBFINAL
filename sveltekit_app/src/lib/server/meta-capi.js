import { env as privateEnv } from '$env/dynamic/private';
import crypto from 'crypto';

const PIXEL_ID = '1672336757255871';
const META_API_URL = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`;

/**
 * Hash a value for Meta CAPI (SHA-256, lowercase hex)
 */
function hash(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

/**
 * Normalise phone to digits only (no +, spaces, dashes)
 */
function normalizePhone(phone) {
  if (!phone) return undefined;
  return phone.replace(/\D/g, '');
}

/**
 * Build user_data object from available info
 */
function buildUserData({ email, phone, name, ipAddress, userAgent, fbp, fbc }) {
  const data = {};

  if (email) data.em = [hash(email)];
  if (phone) data.ph = [hash(normalizePhone(phone))];

  if (name) {
    const parts = name.trim().split(/\s+/);
    data.fn = [hash(parts[0])];
    if (parts.length > 1) data.ln = [hash(parts.slice(1).join(' '))];
  }

  if (ipAddress) data.client_ip_address = ipAddress;
  if (userAgent) data.client_user_agent = userAgent;
  if (fbp) data.fbp = fbp;
  if (fbc) data.fbc = fbc;

  return data;
}

/**
 * Send an event to Meta Conversions API
 *
 * @param {Object} params
 * @param {string} params.eventName - Meta event name (e.g. 'Lead', 'PageView')
 * @param {number} [params.eventTime] - Unix timestamp in seconds (defaults to now)
 * @param {string} [params.eventSourceUrl] - The URL where the event occurred
 * @param {Object} [params.userData] - { email, phone, name, ipAddress, userAgent, fbp, fbc }
 * @param {Object} [params.customData] - Custom event data (e.g. { value: 100, currency: 'RON' })
 */
export async function sendCapiEvent({ eventName, eventTime, eventSourceUrl, userData = {}, customData = {} }) {
  const accessToken = privateEnv.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('[Meta CAPI] Missing META_CAPI_ACCESS_TOKEN, skipping event:', eventName);
    return null;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime || Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: buildUserData(userData),
        custom_data: customData,
        event_id: crypto.randomUUID(),
      },
    ],
  };

  try {
    const url = new URL(META_API_URL);
    url.searchParams.set('access_token', accessToken);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await response.json();

    if (!response.ok) {
      console.error('[Meta CAPI] Error sending event:', body);
    }

    return body;
  } catch (err) {
    console.error('[Meta CAPI] Network error:', err.message);
    return null;
  }
}
