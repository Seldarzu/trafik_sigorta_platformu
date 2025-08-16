// src/main/java/com/trafik/teklif_api/service/impl/AnalyticsServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.dto.analytics.AnalyticsResponse;
import com.trafik.teklif_api.entity.*;
import com.trafik.teklif_api.model.enums.QuoteStatus;
import com.trafik.teklif_api.repository.*;
import com.trafik.teklif_api.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsServiceImpl implements AnalyticsService {

    private final QuoteRepository quoteRepo;
    private final PolicyRepository policyRepo;
    private final CustomerRepository customerRepo;
    private final VehicleRepository vehicleRepo;
    private final PolicyClaimRepository claimRepo;

    

    /* ===================== SUMMARY ===================== */
    @Override
    @Transactional(readOnly = true)
    public OverviewDto getSummary() {
        long totalQuotes   = quoteRepo.count();
        long totalPolicies = policyRepo.count();

        BigDecimal totalRevenueBD = sum(policyRepo.findAll(), Policy::getFinalPremium);

        double conversionRate = totalQuotes == 0 ? 0.0
                : round(((double) totalPolicies / (double) totalQuotes) * 100.0, 2);

        double averagePremium = totalPolicies == 0 ? 0.0
                : totalRevenueBD
                .divide(BigDecimal.valueOf(totalPolicies), 2, RoundingMode.HALF_UP)
                .doubleValue();

        return new OverviewDto(
                totalRevenueBD.doubleValue(),
                totalPolicies,
                conversionRate,
                averagePremium
        );
    }

    /* ===================== MONTHLY ===================== */
    // Not: DTO şekli net değil (record). Derlenmesi için boş liste döndürüyoruz.
    @Override
    @Transactional(readOnly = true)
    public List<MonthlyDto> getMonthly(String period) {
        return Collections.emptyList();
    }

    /* ===================== RISK DISTRIBUTION ===================== */
    // Not: RiskDto imzası paylaşılmadığı için uyumlu bir boş liste döndürüyoruz.
    @Override
    @Transactional(readOnly = true)
    public List<RiskDto> getRiskDistribution(String period) {
        return Collections.emptyList();
    }

    // Ek yardımcı (arayüzde yoksa @Override KOYMAYIN)
    @Transactional(readOnly = true)
    public Map<String, Object> riskDistribution() {
        Map<String, Long> dist = quoteRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        q -> q.getRiskLevel() == null ? "UNKNOWN" : q.getRiskLevel().name(),
                        Collectors.counting()
                ));
        return Map.of("distribution", dist);
    }

    /* ===================== CUSTOMER SEGMENTS ===================== */
    @Override
    @Transactional(readOnly = true)
    public List<SegmentDto> getCustomerSegments(String period) {
        Map<Customer, Long> countByCustomer = policyRepo.findAll().stream()
                .filter(p -> p.getCustomer() != null)
                .collect(Collectors.groupingBy(Policy::getCustomer, Collectors.counting()));

        long light   = countByCustomer.values().stream().filter(c -> c == 1).count();
        long regular = countByCustomer.values().stream().filter(c -> c == 2).count();
        long loyal   = countByCustomer.values().stream().filter(c -> c >= 3).count();

        long total = light + regular + loyal;
        double vLight   = total == 0 ? 0.0 : round((light   * 100.0) / total, 1);
        double vRegular = total == 0 ? 0.0 : round((regular * 100.0) / total, 1);
        double vLoyal   = total == 0 ? 0.0 : round((loyal   * 100.0) / total, 1);

        return List.of(
                new SegmentDto("New/Light", light,   vLight,   "#60a5fa"),
                new SegmentDto("Regular",   regular, vRegular, "#34d399"),
                new SegmentDto("Loyal",     loyal,   vLoyal,   "#f59e0b")
        );
    }

    // Ek yardımcı (arayüzde yoksa @Override KOYMAYIN)
    @Transactional(readOnly = true)
    public Map<String, Object> customerSegments() {
        Map<String, Long> seg = customerRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        c -> String.valueOf(c.getCustomerValue()),
                        Collectors.counting()
                ));
        return Map.of("segments", seg);
    }

    /* ===================== PERFORMANCE METRICS ===================== */
    @Override
    @Transactional(readOnly = true)
    public List<PerformanceDto> getPerformanceMetrics(String period) {
        long totalQuotes   = quoteRepo.count();
        List<Policy> policies = policyRepo.findAll();
        long totalPolicies = policies.size();
        BigDecimal totalRevenueBD = sum(policies, Policy::getFinalPremium);

        double conversion = totalQuotes == 0 ? 0.0
                : round(((double) totalPolicies / (double) totalQuotes) * 100.0, 2);

        double avgPremium = totalPolicies == 0 ? 0.0
                : totalRevenueBD
                .divide(BigDecimal.valueOf(totalPolicies), 2, RoundingMode.HALF_UP)
                .doubleValue();

        return List.of(
                new PerformanceDto("Total Quotes",   (double) totalQuotes, 0.0, 0.0, "count"),
                new PerformanceDto("Total Policies", (double) totalPolicies, 0.0, 0.0, "count"),
                new PerformanceDto("Conversion Rate",(conversion), 0.0, 0.0, "%"),
                new PerformanceDto("Avg Premium",    avgPremium, 0.0, 0.0, "TRY")
        );
    }

    // Basit özet (arayüzde varsa @Override; yoksa kaldır)
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> performance() {
        long totalQuotes = quoteRepo.count();
        long totalPolicies = policyRepo.count();
        double conversion = totalQuotes == 0 ? 0.0
                : round(((double) totalPolicies / (double) totalQuotes) * 100.0, 2);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("totalQuotes", totalQuotes);
        res.put("totalPolicies", totalPolicies);
        res.put("conversionRate", conversion);
        return res;
    }

    /* ===================== BRANDS ===================== */
    @Override
    @Transactional(readOnly = true)
    public List<BrandDto> getTopBrands(String period) {
        Map<String, Long> byBrand = vehicleRepo.findAll().stream()
                .map(v -> safe(v.getBrand()))
                .filter(b -> !b.isBlank())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        return byBrand.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(10)
                // revenue bilgisini bağlayacak veri yoksa 0 veriyoruz
                .map(e -> new BrandDto(e.getKey(), e.getValue(), 0L))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> vehicleBrands() {
        Map<String, Long> byBrand = vehicleRepo.findAll().stream()
                .map(v -> safe(v.getBrand()))
                .filter(b -> !b.isBlank())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("brands", byBrand);
        res.put("total", byBrand.values().stream().mapToLong(Long::longValue).sum());
        return res;
    }

    /* ===================== CLAIMS ===================== */
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> claimsAnalysis() {
        Map<String, Object> res = new LinkedHashMap<>();
        try {
            Map<String, Long> stats = claimRepo.findAll().stream()
                    .collect(Collectors.groupingBy(PolicyClaim::getClaimType, Collectors.counting()));
            res.put("claims", stats);
            res.put("totalClaims", stats.values().stream().mapToLong(Long::longValue).sum());
        } catch (Exception ignore) {
            res.put("totalClaims", 0L);
            res.put("claims", Collections.emptyMap());
        }
        res.putIfAbsent("lossRatio", 0.0);
        return res;
    }

    /* ===================== REVENUE ===================== */
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> revenue() {
        List<Policy> policies = policyRepo.findAll();
        BigDecimal totalRevenueBD = sum(policies, Policy::getFinalPremium);
        double avgPremium = policies.isEmpty() ? 0.0
                : totalRevenueBD
                .divide(BigDecimal.valueOf(policies.size()), 2, RoundingMode.HALF_UP)
                .doubleValue();

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("totalRevenue", totalRevenueBD.doubleValue());
        res.put("avgPremium", avgPremium);
        res.put("currency", "TRY");
        return res;
    }

    /* ===================== DASHBOARD ===================== */
    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponse dashboard() {
        long totalCustomers = customerRepo.count();
        long totalPolicies  = policyRepo.count();
        long totalQuotes    = quoteRepo.count();

        long pendingQuotes  = quoteRepo.findAll().stream()
                .filter(q -> q.getStatus() == QuoteStatus.PENDING).count();

        long approvedQuotes = quoteRepo.findAll().stream()
                .filter(q -> q.getStatus() == QuoteStatus.APPROVED).count();

        double totalRevenue = sum(policyRepo.findAll(), Policy::getFinalPremium).doubleValue();

        List<AnalyticsResponse.RecentQuote> recentQuotes = quoteRepo.findAll().stream()
                .sorted((a, b) -> nz(b.getCreatedAt()).compareTo(nz(a.getCreatedAt())))
                .limit(5)
                .map(q -> new AnalyticsResponse.RecentQuote(
                        q.getId().toString(),
                        q.getVehicle() != null ? safe(q.getVehicle().getPlateNumber()) : "",
                        q.getFinalPremium() == null ? 0.0 : q.getFinalPremium().doubleValue(),
                        nz(q.getCreatedAt()).toString()
                ))
                .toList();

        return new AnalyticsResponse(
                totalCustomers,
                totalPolicies,
                totalQuotes,
                pendingQuotes,
                approvedQuotes,
                totalRevenue,
                recentQuotes
        );
    }

    /* ===================== HELPERS ===================== */
    private BigDecimal sum(Collection<Policy> list, Function<Policy, BigDecimal> f) {
        return list.stream()
                .map(f)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private OffsetDateTime nz(OffsetDateTime t) {
        return t == null ? OffsetDateTime.now(ZoneOffset.UTC) : t;
    }

    private double round(double v, int s) {
        double m = Math.pow(10, s);
        return Math.round(v * m) / m;
    }

    private String safe(String s) {
        return s == null ? "" : s.trim();
    }
}
