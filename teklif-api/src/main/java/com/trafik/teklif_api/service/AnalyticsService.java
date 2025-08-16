// src/main/java/com/trafik/teklif_api/service/AnalyticsService.java
package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.dto.analytics.AnalyticsResponse;

import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    // DTO tabanlı uçlar
    OverviewDto getSummary();
    List<MonthlyDto> getMonthly(String period);
    List<RiskDto> getRiskDistribution(String period);
    List<SegmentDto> getCustomerSegments(String period);
    List<PerformanceDto> getPerformanceMetrics(String period);
    List<BrandDto> getTopBrands(String period);

    // Map tabanlı uçlar
    Map<String, Object> vehicleBrands();
    Map<String, Object> claimsAnalysis();
    Map<String, Object> performance();
    Map<String, Object> revenue();

    // Dashboard birleşik cevap
    AnalyticsResponse dashboard();
}
