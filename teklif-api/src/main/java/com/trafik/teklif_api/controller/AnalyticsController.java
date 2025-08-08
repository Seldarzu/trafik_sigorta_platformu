// // src/main/java/com/trafik/teklif_api/controller/AnalyticsController.java
// package com.trafik.teklif_api.controller;

// import com.trafik.teklif_api.dto.OverviewDto;
// import com.trafik.teklif_api.dto.MonthlyDto;
// import com.trafik.teklif_api.dto.RiskDto;
// import com.trafik.teklif_api.dto.SegmentDto;
// import com.trafik.teklif_api.dto.PerformanceDto;
// import com.trafik.teklif_api.dto.BrandDto;
// import com.trafik.teklif_api.service.AnalyticsService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @CrossOrigin(origins = "http://localhost:5173")
// @RestController
// @RequestMapping("/api/analytics")
// @RequiredArgsConstructor
// public class AnalyticsController {
//     private final AnalyticsService service;

//     @GetMapping("/summary")
//     public OverviewDto summary() {
//         return service.getSummary();
//     }

//     @GetMapping("/monthly")
//     public List<MonthlyDto> monthly(@RequestParam String period) {
//         return service.getMonthly(period);
//     }

//     @GetMapping("/risk-distribution")
//     public List<RiskDto> riskDistribution(@RequestParam String period) {
//         return service.getRiskDistribution(period);
//     }

//     @GetMapping("/customer-segments")
//     public List<SegmentDto> customerSegments(@RequestParam String period) {
//         return service.getCustomerSegments(period);
//     }

//     @GetMapping("/performance-metrics")
//     public List<PerformanceDto> performanceMetrics(@RequestParam String period) {
//         return service.getPerformanceMetrics(period);
//     }

//     @GetMapping("/top-brands")
//     public List<BrandDto> topBrands(@RequestParam String period) {
//         return service.getTopBrands(period);
//     }
// }
//TODO:bu katmana bak