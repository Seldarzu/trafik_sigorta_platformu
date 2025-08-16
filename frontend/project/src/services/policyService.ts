// src/services/PolicyService.ts
import api from '@/api/axios';
import type { Policy, PolicyInstallment, PolicyClaim } from '@/types';

/** baseURL '/api' ile bitmiyorsa yolu '/api' ile dener */
const withApiPrefix = (path: string) => {
  const b = (api.defaults as any)?.baseURL ?? '';
  return typeof b === 'string' && b.endsWith('/api') ? path : `/api${path}`;
};

async function get<T = any>(path: string, cfg?: any): Promise<T> {
  try {
    const { data } = await api.get<T>(path, cfg);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404 && path.startsWith('/')) {
      const { data } = await api.get<T>(withApiPrefix(path), cfg);
      return data;
    }
    throw e;
  }
}

async function post<T = any>(path: string, body?: any, cfg?: any): Promise<T> {
  try {
    const { data } = await api.post<T>(path, body, cfg);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404 && path.startsWith('/')) {
      const { data } = await api.post<T>(withApiPrefix(path), body, cfg);
      return data;
    }
    throw e;
  }
}

const BASE = '/policies'; // tüm yollar /api + BASE

export const policyService = {
  // Listeleme (opsiyonel durum filtresi)
  async getPolicies(params?: { status?: 'active' | 'expired' | 'pending' | 'cancelled', page?: number, size?: number }) {
    const data = await get<Policy[]>(`${BASE}`, { params });
    return data;
  },

  // Tekil kayıt
  async getPolicyById(id: string) {
    const data = await get<Policy>(`${BASE}/${id}`);
    return data;
  },

  // Yenileme
  async renewPolicy(id: string) {
    const data = await post<Policy>(`${BASE}/${id}/renew`);
    return data;
  },

  // Sunucudaki arama ucu (GET /api/policies/search)
  async searchPolicies(q: { text?: string; status?: string; customerId?: string; from?: string; to?: string; page?: number; size?: number }) {
    const data = await get<Policy[]>(`${BASE}/search`, { params: q });
    return data;
  },

  // Yakında bitecekler (GET /api/policies/expiring)
  async getExpiring() {
    const data = await get<Policy[]>(`${BASE}/expiring`);
    return data;
  },

  // Poliçe taksitleri
  async getPolicyInstallments(id: string) {
    try {
      const data = await get<PolicyInstallment[]>(`${BASE}/${id}/installments`);
      return data;
    } catch (e: any) {
      if (e?.response?.status === 404) return [];
      throw e;
    }
  },

  // Poliçe hasar kayıtları
  async getPolicyClaims(id: string) {
    try {
      const data = await get<PolicyClaim[]>(`${BASE}/${id}/claims`);
      return data;
    } catch (e: any) {
      if (e?.response?.status === 404) return [];
      throw e;
    }
  },

  // Müşteri bazlı poliçe listesi
  async getPoliciesByCustomer(customerId: string) {
    const data = await get<Policy[]>(`/customers/${customerId}/policies`);
    return data;
  },

  // Tekliften poliçe oluşturma (POST /api/policies/create-from-quote)
  async createFromQuote(quoteId: string, startDate: string) {
    const data = await post(`${BASE}/create-from-quote`, { quoteId, startDate });
    return data as Policy;
  },
};

export const PolicyService = policyService;
export default policyService;
