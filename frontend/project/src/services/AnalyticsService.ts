import api from '../api/axios';
import {
  OverviewData,
  MonthlyData,
  RiskDistribution,
  BrandData,
  SegmentData,
  PerformanceMetric
} from '../types';

export const AnalyticsService = {
  getOverview: (): Promise<OverviewData> =>
    api.get<OverviewData>('/analytics/summary').then(res => res.data),

  getMonthly: (period: string): Promise<MonthlyData[]> =>
    api.get<MonthlyData[]>(`/analytics/monthly?period=${period}`).then(res => res.data),

  getRiskDistribution: (period: string): Promise<RiskDistribution[]> =>
    api.get<RiskDistribution[]>(`/analytics/risk-distribution?period=${period}`).then(res => res.data),

  getTopBrands: (period: string): Promise<BrandData[]> =>
    api.get<BrandData[]>(`/analytics/top-brands?period=${period}`).then(res => res.data),

  getCustomerSegments: (period: string): Promise<SegmentData[]> =>
    api.get<SegmentData[]>(`/analytics/customer-segments?period=${period}`).then(res => res.data),

  getPerformanceMetrics: (period: string): Promise<PerformanceMetric[]> =>
    api.get<PerformanceMetric[]>(`/analytics/performance-metrics?period=${period}`).then(res => res.data),
};
