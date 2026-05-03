// pandamarket/frontend/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

class PdApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) { this.baseUrl = baseUrl; }
  setToken(token: string) { this.token = token; }
  clearToken() { this.token = null; }

  private async request<T>(method: string, path: string, opts?: { body?: unknown; params?: Record<string, string> }): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (opts?.params) Object.entries(opts.params).forEach(([k, v]) => url.searchParams.set(k, v));
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(url.toString(), { method, headers, body: opts?.body ? JSON.stringify(opts.body) : undefined, credentials: 'include' });
    if (!res.ok) { const err = await res.json().catch(() => ({ error: { code: 'PD_INTERNAL_ERROR', message: 'Erreur réseau', details: {} } })); throw err; }
    return res.json();
  }

  // Generic methods
  async get<T = any>(path: string, params?: Record<string, string>) { return this.request<T>('GET', `/api${path}`, { params }); }
  async post<T = any>(path: string, body?: any) { return this.request<T>('POST', `/api${path}`, { body }); }
  async put<T = any>(path: string, body?: any) { return this.request<T>('PUT', `/api${path}`, { body }); }
  async delete<T = any>(path: string) { return this.request<T>('DELETE', `/api${path}`); }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ access_token: string; vendor: any; store: any }>(
      'POST', '/api/pd/auth/login', { body: { email, password } }
    );
  }

  async register(data: {
    first_name: string; last_name: string; email: string; password: string;
    store_name: string; subdomain: string; category?: string;
  }) {
    return this.request<{ access_token: string; vendor: any; store: any }>(
      'POST', '/api/pd/auth/register', { body: data }
    );
  }

  // Specific domain methods
  async getStore(id: string) { return this.request('GET', `/api/pd/stores/${id}`); }
  async getProduct(id: string) { return this.request('GET', `/store/products/${id}`); }
  async getPlans() { return this.request('GET', '/api/pd/subscriptions/plans'); }
  async getWallet() { return this.request('GET', '/api/pd/wallet'); }
  async getVerificationStatus() { return this.request('GET', '/api/pd/verification'); }
  async getNotifications(page = 1) { return this.request('GET', '/api/pd/notifications', { params: { page: String(page) } }); }
  async getUnreadCount() { return this.request('GET', '/api/pd/notifications', { params: { action: 'unread-count' } }); }
}

export const api = new PdApiClient(API_URL);
export default api;
