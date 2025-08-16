package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.dto.analytics.AnalyticsResponse;
import com.trafik.teklif_api.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    // ——— Mevcut endpoint’ler ———
    @GetMapping("/summary")
    public OverviewDto summary() {
        return service.getSummary();
    }

    @GetMapping("/monthly")
    public List<MonthlyDto> monthly(@RequestParam String period) {
        return service.getMonthly(period);
    }

    @GetMapping("/risk-distribution")
    public List<RiskDto> riskDistribution(@RequestParam String period) {
        return service.getRiskDistribution(period);
    }

    @GetMapping("/customer-segments")
    public List<SegmentDto> customerSegments(@RequestParam String period) {
        return service.getCustomerSegments(period);
    }

    @GetMapping("/performance-metrics")
    public List<PerformanceDto> performanceMetrics(@RequestParam String period) {
        return service.getPerformanceMetrics(period);
    }

    @GetMapping("/top-brands")
    public List<BrandDto> topBrands(@RequestParam String period) {
        return service.getTopBrands(period);
    }

    // ——— Yeni eklenen endpoint’ler ———
    @GetMapping("/vehicle-brands")
    public Map<String, Object> brands() {
        return service.vehicleBrands();
    }

    @GetMapping("/claims-analysis")
    public Map<String, Object> claims() {
        return service.claimsAnalysis();
    }

    // ——— Spec ile geriye dönük uyum alias’lar ———
    // /api/analytics/dashboard  -> summary
    @GetMapping("/dashboard")
    public AnalyticsResponse dashboard() {
        return service.dashboard();
    }

    // /api/analytics/sales -> monthly (default period=month)
    @GetMapping("/sales")
    public List<MonthlyDto> sales(@RequestParam(name = "period", required = false, defaultValue = "month") String period) {
        return service.getMonthly(period);
    }

    // /api/analytics/performance -> performance-metrics
    @GetMapping("/performance")
    public Map<String, Object> performance() {
        return service.performance();
    }

    // /api/analytics/revenue -> monthly (sadece revenue alanını kullanan UI’lar için aynı DTO uygun)
    @GetMapping("/revenue")
    public Map<String, Object> revenue() {
        return service.revenue();
    }
}
