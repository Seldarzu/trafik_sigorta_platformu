// src/hooks/useAnalytics.ts
import { useQuery } from 'react-query';
import { AnalyticsService } from '../services/AnalyticsService';
import {
  OverviewData,
  MonthlyData,
  RiskDistribution,
  BrandData,
  SegmentData,
  PerformanceMetric
} from '../types';

export function useAnalytics(period: string) {
  const summaryQ = useQuery<OverviewData, Error>(
    ['analytics', 'summary'],
    () => AnalyticsService.getOverview()
  );
  const monthlyQ = useQuery<MonthlyData[], Error>(
    ['analytics', 'monthly', period],
    () => AnalyticsService.getMonthly(period)
  );
  const riskQ = useQuery<RiskDistribution[], Error>(
    ['analytics', 'risk', period],
    () => AnalyticsService.getRiskDistribution(period)
  );
  const topBrandsQ = useQuery<BrandData[], Error>(
    ['analytics', 'brands', period],
    () => AnalyticsService.getTopBrands(period)
  );
  const segmentsQ = useQuery<SegmentData[], Error>(
    ['analytics', 'segments', period],
    () => AnalyticsService.getCustomerSegments(period)
  );
  const perfQ = useQuery<PerformanceMetric[], Error>(
    ['analytics', 'performance', period],
    () => AnalyticsService.getPerformanceMetrics(period)
  );

  return {
    summary: summaryQ.data,
    monthlyData: monthlyQ.data,
    riskDistribution: riskQ.data,
    topVehicleBrands: topBrandsQ.data,
    customerSegments: segmentsQ.data,
    performanceMetrics: perfQ.data,
    loading:
      summaryQ.isLoading ||
      monthlyQ.isLoading ||
      riskQ.isLoading ||
      topBrandsQ.isLoading ||
      segmentsQ.isLoading ||
      perfQ.isLoading,
    error:
      summaryQ.error?.message ||
      monthlyQ.error?.message ||
      riskQ.error?.message ||
      topBrandsQ.error?.message ||
      segmentsQ.error?.message ||
      perfQ.error?.message
  };
}
