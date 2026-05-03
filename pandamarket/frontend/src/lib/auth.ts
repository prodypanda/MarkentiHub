// pandamarket/frontend/src/lib/auth.ts
// Auth state helpers — token stored in localStorage

const TOKEN_KEY = 'pd_access_token';
const VENDOR_KEY = 'pd_vendor';
const STORE_KEY = 'pd_store';

export function saveAuthSession(accessToken: string, vendor: object, store: object) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(VENDOR_KEY, JSON.stringify(vendor));
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getVendor(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(VENDOR_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStore(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VENDOR_KEY);
  localStorage.removeItem(STORE_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
