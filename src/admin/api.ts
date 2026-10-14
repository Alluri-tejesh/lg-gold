import { api, ApiError } from '../customer/api';
import type { Storefront } from '../data/storefront';

/** A problem worth showing to the admin as it is (wrong password, a photo that cannot be read, a conflict). */
export class AdminError extends Error {}

export interface AdminMe {
  admin: boolean;
  username: string;
  /** False until ADMIN_USERNAME and ADMIN_PASSWORD are set in server/.env. */
  configured: boolean;
  /** Can the server send SMS codes: "live" (Twilio set up), "test" (codes printed in the terminal) or "none". */
  sms: 'live' | 'test' | 'none';
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  orders: number;
  spent: number;
}

export const adminMe = () => api<AdminMe>('/admin/me');
export const adminLogin = (username: string, password: string) => api<{ username: string }>('/admin/login', 'POST', { username, password });
export const adminLogout = () => api('/admin/logout', 'POST');

export const loadStore = () => api<Storefront>('/storefront');
export const saveStore = (store: Omit<Storefront, 'updatedAt'>) => api<Storefront>('/admin/storefront', 'PUT', store);

/** Uploads an already-resized photo. Returns its path on the site, e.g. "api/images/66f…". */
export async function uploadImage(blob: Blob): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/api/admin/images', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-LG-Client': 'web', 'Content-Type': blob.type },
      body: blob,
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new AdminError('The photo could not be uploaded. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || 'The photo could not be uploaded.', res.status);
  return data.path as string;
}
