import crypto from 'crypto';

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'changeme123';
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'hospital-admin-secret';

export function createSessionToken() {
  return crypto
    .createHash('sha256')
    .update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:${ADMIN_SECRET}`)
    .digest('hex');
}

export function verifySessionToken(token) {
  return Boolean(token) && token === createSessionToken();
}
