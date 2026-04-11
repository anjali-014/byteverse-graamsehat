import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

export function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') {
    return false;
  }

  const [algo, salt, hash] = storedHash.split('$');
  if (algo !== 'scrypt' || !salt || !hash) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return timingSafeEqual(Buffer.from(hash, 'hex'), derivedKey);
}
