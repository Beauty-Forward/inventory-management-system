/**
 * Generates human-readable warehouse references for donations.
 *   BFD-YYYYMMDD-XXXXXXXX — delivery-app donation (mirrors donor's drop-off code)
 *   BFW-YYYYMMDD-XXXXXXXX — walk-in donation (created in IMS only)
 */

function randomToken(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  for (let i = 0; i < length; i++) {
    const value = buf[i] ?? 0;
    out += chars[value % chars.length];
  }
  return out;
}

function datePart(now = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export function generateWalkInReference(now = new Date()): string {
  return `BFW-${datePart(now)}-${randomToken(8)}`;
}

export function generateDeliveryFallbackReference(now = new Date()): string {
  return `BFD-${datePart(now)}-${randomToken(8)}`;
}
