import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHash,
  createHmac,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export const secret = () => randomBytes(32).toString("hex");
export const digest = (value) =>
  createHash("sha256").update(value).digest("hex");
export const sign = (value, key) =>
  createHmac("sha256", key).update(value).digest("hex");
export function equal(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt:${salt}:${key.toString("hex")}`;
}
export async function checkPassword(password, encoded) {
  if (!encoded) return false;
  const [, salt, expected] = encoded.split(":");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return equal(key.toString("hex"), expected);
}
export const publicCustomer = (u) => ({
  id: u._id.toString(),
  name: u.name,
  email: u.email || "",
  phone: u.phone || "",
  emailVerified: !!u.emailVerified,
  phoneVerified: !!u.phoneVerified,
  role: u.role,
  hasPassword: !!u.passwordHash,
  addresses: u.addresses || [],
  createdAt: u.createdAt,
});
