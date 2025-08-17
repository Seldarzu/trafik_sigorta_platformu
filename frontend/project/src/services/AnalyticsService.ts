import api from '@/api/axios';

export type Period = 'week' | 'month' | 'quarter' | 'year';

const base: unknown = (api as any)?.defaults?.baseURL;
const ANALYTICS_PREFIX =
  typeof base === 'string' && base.endsWith('/api') ? 'analytics' : '/api/analytics';

const url = (path: string) => `${ANALYTICS_PREFIX}/${path}`;

/* ---------------- helpers: parse/normalize ---------------- */
const toNum = (v: any): number => {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const normSummary = (raw: any) => ({
  totalRevenue: toNum(raw?.totalRevenue ?? raw?.total_revenue ?? raw?.revenue ?? raw?.sum),
  totalPolicies: toNum(raw?.totalPolicies ?? raw?.total_policies ?? raw?.policies ?? raw?.policyCount),
  conversionRate: toNum(raw?.conversionRate ?? raw?.conversion_rate ?? raw?.conversion ?? raw?.rate),
  averagePremium: toNum(raw?.averagePremium ?? raw?.average_premium ?? raw?.avgPremium),
});

type Monthly = { month: string; revenue: number; policies: number; quotes: number };
const normMonthly = (arr: any[]): Monthly[] =>
  (arr ?? []).map((r) => ({
    month: String(r?.month ?? r?.label ?? r?.name ?? ''),
    revenue: toNum(r?.revenue ?? r?.revenueAmount ?? r?.amount ?? r?.sumRevenue),
    policies: toNum(r?.policies ?? r?.policyCount ?? r?.countPolicies),
    quotes: toNum(r?.quotes ?? r?.quoteCount ?? r?.countQuotes),
  }))
  .filter(x => x.month);

type Risk = { level: 'low'|'medium'|'high'|string; count: number; percentage: number; color?: string };
const normRisk = (arr: any[]): Risk[] => {
  const mapLevel = (v: any) => {
    const s = String(v ?? '').toLowerCase();
    if (s.includes('low') || s.includes('düş')) return 'low';
    if (s.includes('med') || s.includes('orta')) return 'medium';
    if (s.includes('high') || s.includes('yük')) return 'high';
    return (s as any) || 'low';
  };
  const rows = (arr ?? []).map(r => ({
    level: mapLevel(r?.level ?? r?.riskLevel ?? r?.risk_level),
    count: toNum(r?.count ?? r?.total ?? r?.value),
    percentage: toNum(r?.percentage ?? r?.percent),
    color: r?.color,
  }));
  // yüzde yoksa hesapla
  const total = rows.reduce((s, x) => s + x.count, 0) || 1;
  return rows.map(x => ({ ...x, percentage: x.percentage || (x.count * 100) / total }));
};

type Perf = { metric: string; current: number; previous: number; target: number; unit: string };
const normPerf = (arr: any[]): Perf[] =>
  (arr ?? []).map(r => ({
    metric: String(r?.metric ?? r?.name ?? ''),
    current: toNum(r?.current ?? r?.value ?? r?.now),
    previous: toNum(r?.previous ?? r?.prev),
    target: toNum(r?.target ?? r?.goal),
    unit: String(r?.unit ?? r?.suffix ?? ''),
  })).filter(x => x.metric);

type Brand = { brand: string; count: number; revenue: number };
const normBrands = (arr: any[]): Brand[] =>
  (arr ?? []).map(r => ({
    brand: String(r?.brand ?? r?.name ?? ''),
    count: toNum(r?.count ?? r?.total),
    revenue: toNum(r?.revenue ?? r?.sum),
  })).filter(x => x.brand);

type Segment = { segment: string; count: number; value: number; color?: string };
const normSegments = (arr: any[]): Segment[] =>
  (arr ?? []).map(r => ({
    segment: String(r?.segment ?? r?.name ?? ''),
    count: toNum(r?.count ?? r?.total),
    value: toNum(r?.value ?? r?.revenue ?? r?.sum),
    color: r?.color,
  })).filter(x => x.segment);

async function safeGet<T>(u: string, fallback: T, params?: Record<string, any>, norm?: (x:any)=>T): Promise<T> {
  try {
    const { data } = await api.get(u, { params });
    return norm ? norm(data) : (data as T);
  } catch {
    return fallback;
  }
}

/* ---------------- service ---------------- */
export const AnalyticsService = {
  getSummary: () =>
    safeGet(url('summary'), { totalRevenue:0, totalPolicies:0, conversionRate:0, averagePremium:0 }, undefined, normSummary),

  getMonthly: (period: Period) =>
    safeGet(url('monthly'), [] as Monthly[], { period }, normMonthly),

  getRiskDistribution: (period: Period) =>
    safeGet(url('risk-distribution'), [] as Risk[], { period }, normRisk),

  getCustomerSegments: (period: Period) =>
    safeGet(url('customer-segments'), [] as Segment[], { period }, normSegments),

  getPerformanceMetrics: (period: Period) =>
    safeGet(url('performance-metrics'), [] as Perf[], { period }, normPerf),

  getTopBrands: (period: Period) =>
    safeGet(url('top-brands'), [] as Brand[], { period }, normBrands),

  // alias’lar
  dashboard: () => safeGet(url('dashboard'), {} as any),
  sales: (period: Period = 'month') => safeGet(url('sales'), [] as any[], { period }),
  performance: () => safeGet(url('performance'), {} as any),
  revenue: () => safeGet(url('revenue'), {} as any),
};

export default AnalyticsService;
