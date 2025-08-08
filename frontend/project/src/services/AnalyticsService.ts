// src/services/AnalyticsService.ts
import api from '../api/axios';
import {
  OverviewData,
  MonthlyData,
  RiskDistribution,
  BrandData,
  SegmentData,
  PerformanceMetric,
  AnalyticsData
} from '../types';

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
    api.get<PerformanceMetric[]>(`/analytics/performance-metrics?period=${period}`).then(r => r.data),

  /**
   * Tek bir çağrıyla tüm analitik verileri getirir.
   * @param period Periyot (örneğin "12m")
   */
  getAll: (period: string = '12m'): Promise<AnalyticsData> => {
    return Promise.all([
      AnalyticsService.getOverview(),
      AnalyticsService.getMonthly(period),
      AnalyticsService.getRiskDistribution(period),
      AnalyticsService.getTopBrands(period),
      AnalyticsService.getCustomerSegments(period),
      AnalyticsService.getPerformanceMetrics(period),
    ]).then(
      ([
        overview,
        monthlyData,
        riskDistribution,
        topVehicleBrands,
        customerSegments,
        performanceMetrics,
      ]) => ({
        totalRevenue: overview.totalRevenue,
        totalPolicies: overview.totalPolicies,
        conversionRate: overview.conversionRate,
        averagePremium: overview.averagePremium,
        monthlyData,
        riskDistribution,
        topVehicleBrands,
        customerSegments,
        performanceMetrics,
      })
    );
  },
};
