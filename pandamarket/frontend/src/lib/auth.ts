// pandamarket/frontend/src/lib/auth.ts
// Auth state helpers — token stored in localStorage

const TOKEN_KEY = 'pd_access_token';
const VENDOR_KEY = 'pd_vendor';
const STORE_KEY = 'pd_store';

interface PdVendorSession {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

interface PdStoreSession {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  subscription_plan: string;
}

export function saveAuthSession(
  accessToken: string,
  vendor: PdVendorSession,
  store: PdStoreSession,
) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(VENDOR_KEY, JSON.stringify(vendor));
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getVendor(): PdVendorSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(VENDOR_KEY);
    return raw ? (JSON.parse(raw) as PdVendorSession) : null;
  } catch {
    return null;
  }
}

export function getStore(): PdStoreSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as PdStoreSession) : null;
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
