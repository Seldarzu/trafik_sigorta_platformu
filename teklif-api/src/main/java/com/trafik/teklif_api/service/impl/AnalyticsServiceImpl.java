// // Dosya: src/main/java/com/trafik/teklif_api/service/impl/AnalyticsServiceImpl.java
// package com.trafik.teklif_api.service.impl;

// import com.trafik.teklif_api.dto.OverviewDto;
// import com.trafik.teklif_api.dto.MonthlyDto;
// import com.trafik.teklif_api.dto.RiskDto;
// import com.trafik.teklif_api.dto.SegmentDto;
// import com.trafik.teklif_api.dto.PerformanceDto;
// import com.trafik.teklif_api.dto.BrandDto;
// import com.trafik.teklif_api.entity.Quote;
// import com.trafik.teklif_api.model.QuoteStatus;
// import com.trafik.teklif_api.repository.QuoteRepository;
// import com.trafik.teklif_api.service.AnalyticsService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.math.BigDecimal;
// import java.math.RoundingMode;
// import java.time.LocalDate;
// import java.time.YearMonth;
// import java.time.format.TextStyle;
// import java.util.*;
// import java.util.function.Function;
// import java.util.stream.Collectors;
// //TODO:bu katmana bak 
// @Service
// @RequiredArgsConstructor
// public class AnalyticsServiceImpl implements AnalyticsService {
//     private final QuoteRepository quoteRepo;

//     @Override
//     public OverviewDto getSummary() {
//         List<Quote> allQuotes = quoteRepo.findAll();

//         // 1) Toplam gelir
//         BigDecimal totalRevenueBD = allQuotes.stream()
//             .map(Quote::getPremiumAmount)
//             .reduce(BigDecimal.ZERO, BigDecimal::add);

//         // 2) Onaylanmış poliçe sayısı
//         long totalPolicies = allQuotes.stream()
//             .filter(q -> q.getStatus() == QuoteStatus.APPROVED)
//             .count();

//         // 3) Toplam teklif sayısı
//         long quoteCount = allQuotes.size();

//         // 4) Dönüşüm oranı (%)
//         double conversionRate = quoteCount > 0
//             ? (double) totalPolicies * 100.0 / quoteCount
//             : 0.0;

//         // 5) Ortalama prim tutarı
//         double averagePremium = quoteCount > 0
//             ? totalRevenueBD
//                 .divide(BigDecimal.valueOf(quoteCount), RoundingMode.HALF_UP)
//                 .doubleValue()
//             : 0.0;

//         return new OverviewDto(
//             totalRevenueBD.doubleValue(),
//             totalPolicies,
//             conversionRate,
//             averagePremium
//         );
//     }
    
//     @Override
//     public List<MonthlyDto> getMonthly(String period) {
//         LocalDate start = calculateStart(period);
//         Map<YearMonth, List<Quote>> grouped = quoteRepo.findAll().stream()
//             .filter(q -> !q.getCreatedAt().toLocalDate().isBefore(start))
//             .collect(Collectors.groupingBy(
//                 q -> YearMonth.from(q.getCreatedAt()),
//                 TreeMap::new,
//                 Collectors.toList()
//             ));

//         Locale tr = Locale.forLanguageTag("tr-TR");
//         return grouped.entrySet().stream()
//             .map(entry -> {
//                 YearMonth ym   = entry.getKey();
//                 List<Quote> list = entry.getValue();

//                 long revenue = list.stream()
//                     .map(Quote::getPremiumAmount)
//                     .mapToLong(BigDecimal::longValue)
//                     .sum();

//                 long policies = list.stream()
//                     .filter(q -> q.getStatus() == QuoteStatus.APPROVED)
//                     .count();

//                 long quotesCount = list.size();
//                 String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, tr);

//                 return new MonthlyDto(monthName, revenue, policies, quotesCount);
//             })
//             .collect(Collectors.toList());
//     }

//     @Override
//     public List<RiskDto> getRiskDistribution(String period) {
//         LocalDate start = calculateStart(period);
//         List<Quote> quotes = quoteRepo.findAll().stream()
//             .filter(q -> !q.getCreatedAt().toLocalDate().isBefore(start))
//             .collect(Collectors.toList());
//         long total = quotes.size();

//         Map<String, Long> counts = quotes.stream()
//             .map(scoreBucket())
//             .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

//         return counts.entrySet().stream()
//             .map(e -> new RiskDto(
//                 e.getKey(),
//                 e.getValue(),
//                 total > 0 ? Math.round(e.getValue() * 100.0 / total) : 0,
//                 riskColor(e.getKey())
//             ))
//             .collect(Collectors.toList());
//     }

//  /*   @Override
//     public List<SegmentDto> getCustomerSegments(String period) {
//         LocalDate start = calculateStart(period);

//         // Müşteri bazlı toplam prim
//        Map<Long, Long> revenueByCustomer = quoteRepo.findAll().stream()
//             .filter(q -> !q.getCreatedAt().toLocalDate().isBefore(start))
//             .collect(Collectors.groupingBy(
//                 Quote::getCustomerId,
//                 Collectors.mapping(
//                     Quote::getPremiumAmount,
//                     Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
//                 )
//             )).entrySet().stream()
//             .collect(Collectors.toMap(
//                 Map.Entry::getKey,
//                 e -> e.getValue().longValue()
//             ));

//         // Segmentlere göre grupla
//         Map<String, List<Long>> segments = revenueByCustomer.values().stream()
//             .collect(Collectors.groupingBy(this::segmentBucket));

//         // DTO’ya dönüştür
//         return segments.entrySet().stream()
//             .map(e -> {
//                 String seg = e.getKey();
//                 List<Long> vals = e.getValue();
//                 long totalValue = vals.stream().mapToLong(Long::longValue).sum();
//                 return new SegmentDto(seg, vals.size(), totalValue, segmentColor(seg));
//             })
//             .collect(Collectors.toList());
//     }
// */
//     @Override
//     public List<PerformanceDto> getPerformanceMetrics(String period) {
//         // Şimdilik demo amaçlı full summary kullanılıyor
//         OverviewDto current  = getSummary();
//         OverviewDto previous = getSummary();

//         return List.of(
//             new PerformanceDto("Toplam Gelir",    current.totalRevenue(),  previous.totalRevenue(),  0, "₺"),
//             new PerformanceDto("Toplam Poliçe",    current.totalPolicies(), previous.totalPolicies(), 0, "adet"),
//             new PerformanceDto("Dönüşüm Oranı",    current.conversionRate(), previous.conversionRate(), 0, "%"),
//             new PerformanceDto("Ortalama Prim",    current.averagePremium(), previous.averagePremium(), 0, "₺")
//         );
//     }

//     @Override
//     public List<BrandDto> getTopBrands(String period) {
//         // Stub: araç markası Quote entity’de olmadığı için boş döndürülüyor
//         return Collections.emptyList();
//     }

//     // ——— Yardımcı Metotlar ———

//     private LocalDate calculateStart(String period) {
//         LocalDate now = LocalDate.now();
//         return switch (period.toLowerCase()) {
//             case "week"    -> now.minusWeeks(1);
//             case "month"   -> now.minusMonths(1);
//             case "quarter" -> now.minusMonths(3);
//             case "year"    -> now.minusYears(1);
//             default        -> now.minusMonths(1);
//         };
//     }

//     private Function<Quote, String> scoreBucket() {
//         return q -> {
//             int s = Optional.ofNullable(q.getRiskScore()).orElse(0);
//             if (s < 4) return "low";
//             if (s < 8) return "medium";
//             return "high";
//         };
//     }

//     private String segmentBucket(long value) {
//         if (value > 20_000) return "platinum";
//         if (value > 5_000)  return "gold";
//         if (value > 1_000)  return "silver";
//         return "bronze";
//     }

//     private String riskColor(String rp) {
//         return switch (rp) {
//             case "low"    -> "#22c55e";
//             case "medium" -> "#eab308";
//             case "high"   -> "#ef4444";
//             default       -> "#6b7280";
//         };
//     }

//     private String segmentColor(String seg) {
//         return switch (seg) {
//             case "platinum" -> "#8b5cf6";
//             case "gold"     -> "#facc15";
//             case "silver"   -> "#9ca3af";
//             case "bronze"   -> "#f59e0b";
//             default         -> "#6b7280";
//         };
//     }
// }
