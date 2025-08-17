import api from '@/api/axios';
import { InsuranceCompany } from '@/types';

export interface CompanyUpsertDto {
  name: string;
  code: string;
  isActive?: boolean;
  contactInfo?: { phone?: string; website?: string; rating?: number | string; };
}

const toNum = (v: number | string | null | undefined) =>
  v == null ? 0 : typeof v === 'string' ? Number(v) : v;

const normalize = (c: any): InsuranceCompany => ({
  id: String(c.id),
  name: c.name ?? '',
  code: c.code ?? '',
  isActive: Boolean(c.isActive),
  contactInfo: {
    phone: c?.contactInfo?.phone ?? '',
    website: c?.contactInfo?.website ?? '',
    rating: toNum(c?.contactInfo?.rating ?? 0),
  },
  createdAt: String(c.createdAt ?? c.created_at ?? new Date().toISOString()),
  updatedAt: String(c.updatedAt ?? c.updated_at ?? new Date().toISOString()),
});

const companyService = {
  async list(params?: { page?: number; size?: number; active?: boolean }): Promise<InsuranceCompany[]> {
    const { page = 0, size = 50, active } = params ?? {};
    const { data } = await api.get('/companies', { params: { page, size, active } });
    if (Array.isArray(data?.content)) return data.content.map(normalize);
    if (Array.isArray(data))          return data.map(normalize);
    return [];
  },
  async get(id: string): Promise<InsuranceCompany> {
    const { data } = await api.get(`/companies/${id}`);
    return normalize(data);
  },
  async create(payload: CompanyUpsertDto): Promise<InsuranceCompany> {
    const { data } = await api.post('/companies', payload);
    return normalize(data);
  },
  async update(id: string, payload: CompanyUpsertDto): Promise<InsuranceCompany> {
    const { data } = await api.put(`/companies/${id}`, payload);
    return normalize(data);
  },
  async toggleActive(id: string, isActive: boolean): Promise<InsuranceCompany> {
    try {
      const { data } = await api.patch(`/companies/${id}`, { isActive });
      return normalize(data);
    } catch {
      const { data } = await api.put(`/companies/${id}`, { isActive });
      return normalize(data);
    }
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  },
};

export default companyService;
