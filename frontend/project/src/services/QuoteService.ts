// src/services/QuoteService.ts
import api from '@/api/axios';
import { ENV } from '@/config/env';

import type {
  Quote,
  CreateQuoteRequest,
  CreateQuoteDto,
  CreateVehicleDto,
  CreateDriverDto,
  VehicleSummary,
  DriverSummary,
  RiskLevel,
  QuoteStatus,
} from '@/types';

/* -------------------- küçük yardımcılar -------------------- */
const toNum = (v: number | string | null | undefined) =>
  v == null ? 0 : typeof v === 'string' ? Number(v) : v;

const toUpperEnum = (v?: string | number | null) =>
  v == null ? undefined : String(v).trim().toUpperCase();

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

async function patch<T = any>(path: string, body?: any, cfg?: any): Promise<T> {
  try {
    const { data } = await api.patch<T>(path, body, cfg);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404 && path.startsWith('/')) {
      const { data } = await api.patch<T>(withApiPrefix(path), body, cfg);
      return data;
    }
    throw e;
  }
}

/* -------------------- enum map'leri -------------------- */
const mapFuel = (v?: string) => {
  const m: Record<string, string> = {
    gasoline: 'GASOLINE',
    benzin: 'GASOLINE',
    diesel: 'DIESEL',
    dizel: 'DIESEL',
    lpg: 'LPG',
    electric: 'ELECTRIC',
    elektrik: 'ELECTRIC',
    hybrid: 'HYBRID',
    hibrit: 'HYBRID',
  };
  const key = v?.trim().toLowerCase() ?? '';
  return m[key] ?? toUpperEnum(v);
};

const mapUsage = (v?: string) => {
  const m: Record<string, string> = {
    personal: 'PERSONAL',
    'özel': 'PERSONAL',
    commercial: 'COMMERCIAL',
    'ticari': 'COMMERCIAL',
    taxi: 'TAXI',
    'taksi': 'TAXI',
    truck: 'TRUCK',
    'kamyon': 'TRUCK',
  };
  const key = v?.trim().toLowerCase() ?? '';
  return m[key] ?? toUpperEnum(v);
};

const mapGender = (v?: string) => {
  const m: Record<string, string> = {
    male: 'MALE',
    erkek: 'MALE',
    female: 'FEMALE',
    kadin: 'FEMALE',
    'kadın': 'FEMALE',
  };
  const key = v?.trim().toLowerCase() ?? '';
  return m[key] ?? toUpperEnum(v);
};

const mapMarital = (v?: string) => {
  const m: Record<string, string> = {
    single: 'SINGLE',
    bekar: 'SINGLE',
    married: 'MARRIED',
    evli: 'MARRIED',
    divorced: 'DIVORCED',
    'boşanmış': 'DIVORCED',
    bosanmis: 'DIVORCED',
    widowed: 'WIDOWED',
    dul: 'WIDOWED',
  };
  const key = v?.trim().toLowerCase() ?? '';
  return m[key] ?? toUpperEnum(v);
};

const mapEducation = (v?: string) => {
  const m: Record<string, string> = {
    primary: 'PRIMARY',
    ilkokul: 'PRIMARY',
    secondary: 'SECONDARY',
    ortaokul: 'SECONDARY',
    high_school: 'HIGH_SCHOOL',
    lise: 'HIGH_SCHOOL',
    university: 'UNIVERSITY',
    universite: 'UNIVERSITY',
    'üniversite': 'UNIVERSITY',
    postgraduate: 'POSTGRADUATE',
    'yüksek lisans': 'POSTGRADUATE',
    doktora: 'POSTGRADUATE',
  };
  const key = v?.trim().toLowerCase() ?? '';
  return m[key] ?? toUpperEnum(v);
};

/* -------------------- enum normalizer'ları -------------------- */
const normalizeRiskLevel = (v?: any): RiskLevel => {
  const s = toUpperEnum(v);
  switch (s) {
    case 'LOW': return 'low';
    case 'MEDIUM': return 'medium';
    case 'HIGH': return 'high';
    default: return 'medium';
  }
};

const normalizeStatus = (v?: any): QuoteStatus => {
  const s = toUpperEnum(v);
  switch (s) {
    case 'DRAFT': return 'draft';
    case 'ACTIVE':
    case 'PENDING': return 'active';
    case 'EXPIRED': return 'expired';
    case 'FINALIZED':
    case 'SOLD': return 'sold';
    default: return 'draft';
  }
};

/* -------------------- özet oluşturucular -------------------- */
const ensureVehicleSummary = (q: any): VehicleSummary | undefined => {
  const v = q.vehicle ?? q.vehicleSummary ?? q.vehicle_summary ?? null;

  if (v) {
    return {
      brand: v.brand ?? v.make ?? '-',
      model: v.model ?? '',
      year: Number(v.year ?? 0),
      plateNumber: v.plateNumber ?? v.plate_number ?? q.plateNumber ?? '',
    };
  }

  const brand = q.vehicleBrand ?? q.brand;
  const model = q.vehicleModel ?? q.model;
  const plate = q.plateNumber ?? q.vehicle_plate;
  const year = q.vehicleYear ?? q.year;

  if (brand || model || plate || year) {
    return {
      brand: brand ?? '-',
      model: model ?? '',
      year: Number(year ?? 0),
      plateNumber: plate ?? '',
    };
  }
  return { brand: '-', model: '', year: 0, plateNumber: '' };
};

const ensureDriverSummary = (q: any): DriverSummary | undefined => {
  const d = q.driver ?? q.driverSummary ?? q.driver_summary ?? null;

  if (d) {
    return {
      firstName: d.firstName ?? d.first_name ?? '',
      lastName: d.lastName ?? d.last_name ?? '',
      profession: d.profession ?? undefined,
      hasAccidents: !!(d.hasAccidents ?? d.has_accidents),
      hasViolations: !!(d.hasViolations ?? d.has_violations),
    };
  }

  const firstName = q.driverFirstName ?? q.firstName;
  const lastName = q.driverLastName ?? q.lastName;
  const profession = q.profession;

  if (firstName || lastName || profession) {
    return {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      profession,
      hasAccidents: !!q.hasAccidents,
      hasViolations: !!q.hasViolations,
    };
  }
  return { firstName: '', lastName: '', profession: '' };
};

/* -------------------- normalizer -------------------- */
const normalizeQuote = (q: any): Quote => ({
  id: String(q.id ?? q.uuid ?? q.quoteId),
  customerId: q.customerId ?? q.customer_id ?? null,
  vehicleId: q.vehicleId ?? q.vehicle_id ?? null,
  driverId: q.driverId ?? q.driver_id ?? null,
  agentId: q.agentId ?? q.agent_id ?? null,

  premium: toNum(q.premium),
  finalPremium: toNum(q.finalPremium),
  totalDiscount: toNum(q.totalDiscount ?? (toNum(q.premium) - toNum(q.finalPremium)) ),
  riskScore: q.riskScore ?? q.risk_score ?? 0,

  riskLevel: normalizeRiskLevel(q.riskLevel ?? q.risk_level),
  status: normalizeStatus(q.status),

  coverageAmount: toNum(q.coverageAmount ?? q.coverage_amount),
  createdAt: String(q.createdAt ?? q.created_at ?? new Date().toISOString()),

  vehicle: ensureVehicleSummary(q),
  driver: ensureDriverSummary(q),

  companyName: q.companyName ?? q.company?.name ?? undefined,
  discounts: q.discounts ?? [],
  uniqueRefNo: q.uniqueRefNo ?? q.unique_ref_no ?? undefined,
  validUntil: q.validUntil ?? q.valid_until ?? undefined,
  policyTerms: q.policyTerms ?? undefined,
  specialConditions: q.specialConditions ?? undefined,
  isRecommended: q.isRecommended ?? undefined,
  recommendationScore: q.recommendationScore ?? undefined,
});

/* -------------------- BE payloadları -------------------- */
const normalizeVehicleForBE = (v: Partial<CreateVehicleDto>) => ({
  plateNumber: v.plateNumber,
  brand: v.brand,
  model: v.model,
  year: v.year,
  engineSize: v.engineSize,
  fuelType: mapFuel(v.fuelType as any),
  usage: mapUsage((v as any).usage),
  cityCode: v.cityCode,
});

const normalizeDriverForBE = (d: Partial<CreateDriverDto>) => ({
  ...d,
  gender: mapGender(d.gender as any),
  maritalStatus: mapMarital(d.maritalStatus as any),
  education: mapEducation(d.education as any),
});

/* -------------------- çeşitli yardımcılar -------------------- */
const extractId = (obj: any) =>
  (obj?.id ?? obj?.vehicleId ?? obj?.driverId ?? obj?.uuid ?? obj) as string;

const computeCoverageAmount = (payload: CreateQuoteDto) => {
  const year = payload.vehicle?.year ?? new Date().getFullYear();
  const age = Math.max(0, new Date().getFullYear() - year);
  const base = 100_000;
  return Math.round(base * (age <= 5 ? 1.2 : 1.0));
};

async function postAndNormalize(url: string, body?: any): Promise<Quote> {
  const data = await post(url, body);
  return normalizeQuote(data);
}
async function getAndNormalize(url: string): Promise<Quote> {
  const data = await get(url);
  return normalizeQuote(data);
}

/* -------------------- arama param tipi -------------------- */
type QuoteSearchParams = Partial<{
  page: number;
  size: number;
  sort: string;
  status: string;
  q: string;
  customerId: string;
  vehicleId: string;
  driverId: string;
  agentId: string;
  riskLevel: string;
  plateNumber: string;
}>;

/* -------------------- servis -------------------- */
export interface CompanyQuoteDto {
  companyId: string;
  companyName: string;
  premium: number | string | null;
  finalPremium: number | string | null;
  coverageAmount: number | string | null;
}

export const quoteService = {
  /** Arama: public → (varsa) /quotes/search(POST) → /quotes(GET) */
  async search(params?: QuoteSearchParams): Promise<Quote[]> {
    // 1) Public arama
    try {
      const data = await get<any>('/public/quotes/search', { params });
      if (Array.isArray(data?.content)) return data.content.map(normalizeQuote);
      if (Array.isArray(data)) return data.map(normalizeQuote);
      if (data && typeof data === 'object') return [normalizeQuote(data)];
      return [];
    } catch {
      // 2) Eğer parametre varsa /quotes/search (POST)
      if (params && Object.keys(params).length > 0) {
        try {
          const data = await post<any>('/quotes/search', params);
          if (Array.isArray(data?.content)) return data.content.map(normalizeQuote);
          if (Array.isArray(data)) return data.map(normalizeQuote);
          if (data && typeof data === 'object') return [normalizeQuote(data)];
          return [];
        } catch {/* düşür */}
      }
      // 3) Geriye uyum: /quotes (GET)
      const data = await get<any>('/quotes', { params });
      if (Array.isArray(data?.content)) return data.content.map(normalizeQuote);
      if (Array.isArray(data)) return data.map(normalizeQuote);
      if (data && typeof data === 'object') return [normalizeQuote(data)];
      return [];
    }
  },

  async list(params?: { page?: number; size?: number; sort?: string; status?: string }): Promise<Quote[]> {
    try {
      const data = await get<any>('/quotes', { params });
      if (Array.isArray(data?.content)) return data.content.map(normalizeQuote);
      if (Array.isArray(data)) return data.map(normalizeQuote);
      if (data && typeof data === 'object') return [normalizeQuote(data)];
      return [];
    } catch (err) {
      console.error('Quote listesi alınamadı:', err);
      return [];
    }
  },

  async createQuote(payload: CreateQuoteRequest): Promise<Quote> {
    return postAndNormalize('/quotes', payload);
  },

  async create(payload: CreateQuoteDto): Promise<Quote> {
    try {
      if (!payload.vehicle) throw new Error('Araç bilgileri gerekli');
      if (!payload.driver) throw new Error('Sürücü bilgileri gerekli');

      // 1) Vehicle
      const vReq = normalizeVehicleForBE(payload.vehicle);
      const vRes = await post('/vehicles', vReq);
      const vehicleId = extractId(vRes);
      if (!vehicleId || typeof vehicleId !== 'string') {
        throw new Error('Araç kaydı başarısız: ID alınamadı.');
      }

      // 2) Driver
      const dReq = normalizeDriverForBE(payload.driver);
      const dRes = await post('/drivers', dReq);
      const driverId = extractId(dRes);
      if (!driverId || typeof driverId !== 'string') {
        throw new Error('Sürücü kaydı başarısız: ID alınamadı.');
      }

      // 3) Agent
      const agentId = (payload as any).agentId || ENV.DEFAULT_AGENT_ID;
      if (!agentId) {
        throw new Error('agentId gerekli. .env dosyanıza VITE_DEFAULT_AGENT_ID=<<uuid>> ekleyin.');
      }

      // 4) coverageAmount
      const coverageAmount =
        (payload as any).coverageAmount ?? computeCoverageAmount(payload);

      // 5) Quote
      const req: CreateQuoteRequest = {
        customerId: payload.customerId ?? null,
        vehicleId,
        driverId,
        agentId,
        riskScore: payload.riskScore,
        premiumAmount: payload.premiumAmount,
        coverageAmount,
      };

      return postAndNormalize('/quotes', req);
    } catch (err: any) {
      const raw = err?.response?.data;
      if (raw?.errors && Array.isArray(raw.errors)) {
        const msg = raw.errors
          .map((e: any) => e?.defaultMessage ?? e?.message ?? 'Hata')
          .join(' • ');
        throw new Error(msg);
      }
      throw err;
    }
  },

  async getQuote(id: string): Promise<Quote> {
    return getAndNormalize(`/quotes/${id}`);
  },

  /** Çoklu uç desteği: önce /company-quotes, 404’te /company-offers */
  async getCompanyQuotes(quoteId: string): Promise<CompanyQuoteDto[]> {
    const mapRows = (rows: any[]): CompanyQuoteDto[] =>
      rows.map((r, idx) => ({
        companyId: String(
          r.companyId ??
          r.company_id ??
          r.id ??
          `COMP_${idx + 1}`
        ),
        companyName:
          r.companyName ??
          r.company_name ??
          r.name ??
          `Şirket ${idx + 1}`,
        premium: toNum(
          r.premium ??
          r.premiumAmount ??
          r.premium_amount
        ),
        finalPremium: toNum(
          r.finalPremium ??
          r.final_premium ??
          r.netPremium ??
          r.net_premium ??
          r.premium
        ),
        coverageAmount: toNum(
          r.coverageAmount ??
          r.coverage_amount ??
          r.coverage
        ),
      }));

    try {
      const rows = await get<any[]>(`/quotes/${quoteId}/company-quotes`);
      if (Array.isArray(rows)) return mapRows(rows);
    } catch (e: any) {
      if (e?.response?.status !== 404) throw e;
    }

    const rows = await get<any[]>(`/quotes/${quoteId}/company-offers`);
    return Array.isArray(rows) ? mapRows(rows) : [];
  },

  /** Şirket seçimi: PATCH body → (404/405) POST ?companyId= → (yine 404) /public fallback */
  async selectCompany(quoteId: string, companyId: string): Promise<Quote> {
    // 1) PATCH body
    try {
      const data = await patch(`/quotes/${quoteId}/select-company`, { companyId });
      return normalizeQuote(data);
    } catch (e: any) {
      if (e?.response?.status !== 404 && e?.response?.status !== 405) throw e;
    }

    // 2) POST query param
    try {
      const data = await post(`/quotes/${quoteId}/select-company`, null, { params: { companyId } });
      return normalizeQuote(data);
    } catch (e: any) {
      if (e?.response?.status !== 404) throw e;
    }

    // 3) /public fallback
    const data = await post(`/public/quotes/${quoteId}/select-company`, null, { params: { companyId } });
    return normalizeQuote(data);
  },

  async finalize(quoteId: string): Promise<Quote> {
    return postAndNormalize(`/quotes/${quoteId}/finalize`);
  },
};

export const QuoteService = quoteService;
export default quoteService;
