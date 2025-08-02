import api from '../api/axios'
import {
  OverviewData,
  MonthlyData,
  RiskDistribution,
  BrandData,
  SegmentData,
  PerformanceMetric
} from '../types'

export const AnalyticsService = {
  getOverview: (): Promise<OverviewData> =>
    api.get<OverviewData>('/analytics/summary').then(r => r.data),
  getMonthly: (period: string): Promise<MonthlyData[]> =>
    api.get<MonthlyData[]>(`/analytics/monthly?period=${period}`).then(r => r.data),
  getRiskDistribution: (period: string): Promise<RiskDistribution[]> =>
    api.get<RiskDistribution[]>(`/analytics/risk-distribution?period=${period}`).then(r => r.data),
  getTopBrands: (period: string): Promise<BrandData[]> =>
    api.get<BrandData[]>(`/analytics/top-brands?period=${period}`).then(r => r.data),
  getCustomerSegments: (period: string): Promise<SegmentData[]> =>
    api.get<SegmentData[]>(`/analytics/customer-segments?period=${period}`).then(r => r.data),
  getPerformanceMetrics: (period: string): Promise<PerformanceMetric[]> =>
    api.get<PerformanceMetric[]>(`/analytics/performance-metrics?period=${period}`).then(r => r.data)
}
