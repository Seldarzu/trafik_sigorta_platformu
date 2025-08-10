import api from '../api/axios'
import { Policy, PolicyInstallment, PolicyClaim } from '../types'

const BASE = '/policies' // tüm yollar /api + BASE

export const policyService = {
  // Listeleme (opsiyonel durum filtresi)
  async getPolicies(params?: { status?: 'active'|'expired'|'pending'|'cancelled' }) {
    const { data } = await api.get<Policy[]>(BASE, { params })
    return data
  },

  // Tekil kayıt
  async getPolicyById(id: string) {
    const { data } = await api.get<Policy>(`${BASE}/${id}`)
    return data
  },

  // Yenileme
  async renewPolicy(id: string) {
    const { data } = await api.post<Policy>(`${BASE}/${id}/renew`)
    return data
  },

  // Sunucudaki arama ucu (Swagger: GET /api/policies/search)
  async searchPolicies(q: { text?: string; status?: string }) {
    const { data } = await api.get<Policy[]>(`${BASE}/search`, { params: q })
    return data
  },

  // Yakında bitecekler (Swagger: GET /api/policies/expiring)
  async getExpiring() {
    const { data } = await api.get<Policy[]>(`${BASE}/expiring`)
    return data
  },

  // Aşağıdakiler Swagger’da görünmüyor; varsa farklı controller’dadır.
  // 404 dönerse UI’ı bozmamak için boş liste döndür.
  async getPolicyInstallments(id: string) {
    try {
      const { data } = await api.get<PolicyInstallment[]>(`${BASE}/${id}/installments`)
      return data
    } catch (e: any) {
      if (e?.response?.status === 404) return []
      throw e
    }
  },

  async getPolicyClaims(id: string) {
    try {
      const { data } = await api.get<PolicyClaim[]>(`${BASE}/${id}/claims`)
      return data
    } catch (e: any) {
      if (e?.response?.status === 404) return []
      throw e
    }
  },
}
