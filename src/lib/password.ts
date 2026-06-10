import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_PREFIX = "scrypt$";
const KEY_LEN = 64;

function parseStoredHash(stored: string): { salt: Buffer; hash: Buffer } | null {
  if (!stored.startsWith(SCRYPT_PREFIX)) return null;
  const parts = stored.split("$");
  if (parts.length !== 4) return null;
  const salt = Buffer.from(parts[2], "hex");
  const hash = Buffer.from(parts[3], "hex");
  if (salt.length === 0 || hash.length === 0) return null;
  return { salt, hash };
}

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEY_LEN);
  return `${SCRYPT_PREFIX}${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parsed = parseStoredHash(stored);
  if (parsed) {
    const derived = scryptSync(plain, parsed.salt, parsed.hash.length);
    if (derived.length !== parsed.hash.length) return false;
    return timingSafeEqual(derived, parsed.hash);
  }
  // Legacy plaintext password — compared for transparent migration on login
  return stored === plain;
}

export function needsRehash(stored: string): boolean {
  return !stored.startsWith(SCRYPT_PREFIX);
}
