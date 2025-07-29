// src/main/java/com/trafik/teklif_api/service/AnalyticsService.java
package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.OverviewDto;
import com.trafik.teklif_api.dto.MonthlyDto;
import com.trafik.teklif_api.dto.RiskDto;
import com.trafik.teklif_api.dto.SegmentDto;
import com.trafik.teklif_api.dto.PerformanceDto;
import com.trafik.teklif_api.dto.BrandDto;

import java.util.List;

public interface AnalyticsService {
    OverviewDto getSummary();
    List<MonthlyDto> getMonthly(String period);
    List<RiskDto> getRiskDistribution(String period);
    List<SegmentDto> getCustomerSegments(String period);
    List<PerformanceDto> getPerformanceMetrics(String period);
    List<BrandDto> getTopBrands(String period);
}
