// src/services/AnalyticsService.ts
import api from '../api/axios';

export type Period = 'week' | 'month' | 'quarter' | 'year';

export const AnalyticsService = {
  getSummary: async () =>
    (await api.get('/analytics/summary')).data,

  getMonthly: async (period: Period) =>
    (await api.get('/analytics/monthly', { params: { period } })).data,

  getRiskDistribution: async (period: Period) =>
    (await api.get('/analytics/risk-distribution', { params: { period } })).data,

  getCustomerSegments: async (period: Period) =>
    (await api.get('/analytics/customer-segments', { params: { period } })).data,

  getPerformanceMetrics: async (period: Period) =>
    (await api.get('/analytics/performance-metrics', { params: { period } })).data,

  getTopBrands: async (period: Period) =>
    (await api.get('/analytics/top-brands', { params: { period } })).data,
};
