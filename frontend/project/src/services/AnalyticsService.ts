import api from '@/api/axios';

export type Period = 'week' | 'month' | 'quarter' | 'year';

const base = (api as any)?.defaults?.baseURL ?? '';
const ANALYTICS_PREFIX =
  typeof base === 'string' && base.endsWith('/api') ? '/analytics' : '/api/analytics';

async function safeGet<T>(url: string, fallback: T, params?: Record<string, any>): Promise<T> {
  try {
    const { data } = await api.get(url, { params });
    return data as T;
  } catch {
    return fallback;
  }
}

export const AnalyticsService = {
  getSummary: () =>
    safeGet(`${ANALYTICS_PREFIX}/summary`, {
      totalRevenue: 0,
      totalPolicies: 0,
      conversionRate: 0,
      averagePremium: 0,
    } as any),

  getMonthly: (period: Period) =>
    safeGet(`${ANALYTICS_PREFIX}/monthly`, [] as any[], { period }),

  getRiskDistribution: (period: Period) =>
    safeGet(`${ANALYTICS_PREFIX}/risk-distribution`, [] as any[], { period }),

  getCustomerSegments: (period: Period) =>
    safeGet(`${ANALYTICS_PREFIX}/customer-segments`, [] as any[], { period }),

  getPerformanceMetrics: (period: Period) =>
    safeGet(`${ANALYTICS_PREFIX}/performance-metrics`, [] as any[], { period }),

  getTopBrands: (period: Period) =>
    safeGet(`${ANALYTICS_PREFIX}/top-brands`, [] as any[], { period }),

  // alias'lar
  dashboard: () => safeGet(`${ANALYTICS_PREFIX}/dashboard`, {} as any),
  sales: (period: Period = 'month') =>
    safeGet(`${ANALYTICS_PREFIX}/sales`, [] as any[], { period }),
  performance: () => safeGet(`${ANALYTICS_PREFIX}/performance`, {} as any),
  revenue: () => safeGet(`${ANALYTICS_PREFIX}/revenue`, {} as any),
};

export default AnalyticsService;
