package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.company.CompanyQuoteDto;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.InsuranceCompany;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.model.enums.FuelType;
import com.trafik.teklif_api.model.enums.UsageType;
import com.trafik.teklif_api.repository.InsuranceCompanyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyPricingService {

    private final QuoteRepository quoteRepository;
    private final InsuranceCompanyRepository companyRepository;

    /** Controller kullanır: Quote + Vehicle + Driver elde edilmişse bu metotla fiyat üret. */
    public List<CompanyQuoteDto> buildCompanyOffers(
            Quote q, Vehicle v, Driver d, List<InsuranceCompany> companies) {

        // 1) Baz prim
        BigDecimal base = (q.getPremium() != null)
                ? toBD(q.getPremium())
                : estimateBasePremium(q, v, d);

        if (companies == null || companies.isEmpty()) return List.of();

        // 2) Şirket stratejileri
        Map<String, CompanyStrategy> strategies = defaultStrategies();

        // 3) Fiyatla
        return companies.stream()
                .map(c -> {
                    String key = resolveStrategyKey(c); // code yoksa/uyuşmazsa isim/id’den “sepet”
                    CompanyStrategy s = strategies.getOrDefault(key, strategies.get("DEFAULT"));
                    return priceForCompany(c, base, q, v, d, s);
                })
                .sorted(Comparator.comparing(CompanyQuoteDto::finalPremium))
                .collect(Collectors.toList());
    }

    /** String ID ile doğrudan teklif üretir (repo ID tipi String). */
    public List<CompanyQuoteDto> generateOffers(String quoteId) {
        if (quoteId == null || quoteId.isBlank()) {
            throw new IllegalArgumentException("quoteId boş olamaz");
        }
        Quote q = quoteRepository.findById(quoteId).orElseThrow();
        Vehicle v = q.getVehicle();
        Driver d  = q.getDriver();
        List<InsuranceCompany> companies = companyRepository.findByIsActiveTrue();
        return buildCompanyOffers(q, v, d, companies);
    }

    /** Geriye dönük uyumluluk: UUID alan eski çağrılar buraya düşebilir. */
    public List<CompanyQuoteDto> generateOffers(UUID quoteId) {
        if (quoteId == null) {
            throw new IllegalArgumentException("quoteId boş olamaz");
        }
        return generateOffers(quoteId.toString());
    }

    private CompanyQuoteDto priceForCompany(
            InsuranceCompany c,
            BigDecimal base,
            Quote q,
            Vehicle v,
            Driver d,
            CompanyStrategy s
    ) {
        // deterministik ufak jitter (şirket bazlı) → tekdüzelik kırılır, ama aynı şirkette stabil kalır
        double premiumJitter  = 1.0 + (((Math.abs(Objects.hash(safe(c.getId()), safe(c.getName()))) % 7) - 3) * 0.01); // ±3%
        double coverageJitter = 1.0 + (((Math.abs(Objects.hash(safe(c.getName()))) % 9) - 4) * 0.02);                // ±8%

        // Prim
        BigDecimal premium = base
                .multiply(s.companyFactor)
                .multiply(riskFactor(q))
                .multiply(vehicleAgeFactor(v))
                .multiply(usageFuelFactor(v))
                .multiply(driverHistoryFactor(d))
                .multiply(bd(premiumJitter))
                .setScale(0, RoundingMode.HALF_UP);

        BigDecimal discount = premium.multiply(s.discountRate);
        if (s.maxDiscount != null) discount = discount.min(s.maxDiscount);
        BigDecimal finalPremium = premium.subtract(discount).max(BigDecimal.ZERO);

        // Kişi başı teminat (dinamik)
        BigDecimal coverage = coverageForCompany(q, v, s)
                .multiply(bd(coverageJitter));

        // 10.000 TL adımına yuvarla ve sınırla (min’i 300k tutarak 100k’ya düşmeyi engelledik)
        coverage = stepRound(coverage, bd(10_000));
        BigDecimal min = bd(300_000);
        BigDecimal max = bd(1_500_000);
        if (coverage.compareTo(min) < 0) coverage = min;
        if (coverage.compareTo(max) > 0) coverage = max;
        coverage = coverage.setScale(0, RoundingMode.HALF_UP);

        return new CompanyQuoteDto(
                c.getId(),
                c.getName(),
                premium,
                finalPremium,
                coverage
        );
    }

    /* ---------- Kurallar ---------- */

    private BigDecimal estimateBasePremium(Quote q, Vehicle v, Driver d) {
        BigDecimal base = bd(3000);
        int risk = Optional.ofNullable(q.getRiskScore()).orElse(50);
        base = base.add(bd(risk * 10L)); // risk başına +10 TL

        int year = Optional.ofNullable(v).map(Vehicle::getYear)
                .orElse(LocalDate.now().getYear() - 10);
        int age = Math.max(0, LocalDate.now().getYear() - year);
        base = base.add(bd(Math.min(15, age) * 50L)); // yaş etkisi

        return base.setScale(0, RoundingMode.HALF_UP);
    }

    private BigDecimal riskFactor(Quote q) {
        String level = String.valueOf(q.getRiskLevel()).toLowerCase(Locale.ROOT);
        return switch (level) {
            case "low"  -> bd(0.92);
            case "high" -> bd(1.15);
            default     -> bd(1.00); // medium/unknown
        };
    }

    private BigDecimal vehicleAgeFactor(Vehicle v) {
        if (v == null || v.getYear() == null) return bd(1.00);
        int age = Math.max(0, LocalDate.now().getYear() - v.getYear());
        if (age <= 3)  return bd(1.06);
        if (age <= 8)  return bd(1.00);
        if (age <= 15) return bd(0.95);
        return bd(0.90);
    }

    private BigDecimal usageFuelFactor(Vehicle v) {
        BigDecimal f = bd(1.00);
        if (v == null) return f;

        UsageType usage = v.getUsage();
        if (usage != null) {
            switch (usage) {
                case COMMERCIAL, TAXI -> f = f.multiply(bd(1.10));
                default -> { /* PERSONAL vs. etkisiz */ }
            }
        }

        FuelType fuel = v.getFuelType();
        if (fuel != null) {
            switch (fuel) {
                case DIESEL   -> f = f.multiply(bd(1.03));
                case ELECTRIC -> f = f.multiply(bd(0.97));
                default -> { /* GASOLINE, LPG, HYBRID vs. etkisiz */ }
            }
        }

        return f;
    }

    private BigDecimal driverHistoryFactor(Driver d) {
        if (d == null) return bd(1.00);
        BigDecimal f = bd(1.00);

        int acc = Optional.ofNullable(d.getAccidentCount()).orElse(0);
        if (acc > 0) {
            f = f.multiply(bd(1.00 + Math.min(0.20, acc * 0.05))); // %5 * kaza, max %20
        }

        int vio = Optional.ofNullable(d.getViolationCount()).orElse(0);
        if (vio > 0) {
            f = f.multiply(bd(1.00 + Math.min(0.15, vio * 0.03))); // %3 * ceza, max %15
        }

        return f;
    }

    /** Şirketlere göre prim/indirim/teminat tabanı + teminat çarpanı. */
    private Map<String, CompanyStrategy> defaultStrategies() {
        Map<String, CompanyStrategy> m = new HashMap<>();
        //                  factor   disc   maxDisc  covBase       covMult
        m.put("ECO",     new CompanyStrategy(bd(0.88), bd(0.10), bd(600),   bd(350_000),    bd(0.95)));
        m.put("DNG",     new CompanyStrategy(bd(1.00), bd(0.05), bd(400),   bd(500_000),    bd(1.00)));
        m.put("PRF",     new CompanyStrategy(bd(1.08), bd(0.04), bd(400),   bd(800_000),    bd(1.08)));
        m.put("PRM",     new CompanyStrategy(bd(1.18), bd(0.06), bd(800),   bd(1_200_000),  bd(1.18)));
        m.put("DEFAULT", new CompanyStrategy(bd(1.00), bd(0.00), null,      bd(500_000),    bd(1.00)));
        return m;
    }

    /* ---------- Teminat Hesabı ---------- */

    private BigDecimal coverageForCompany(Quote q, Vehicle v, CompanyStrategy s) {
        return s.coverageBase
                .multiply(s.coverageMultiplier)
                .multiply(coverageRiskFactor(q))
                .multiply(coverageVehicleFactor(v));
    }

    private BigDecimal coverageRiskFactor(Quote q) {
        String level = String.valueOf(q.getRiskLevel()).toLowerCase(Locale.ROOT);
        return switch (level) {
            case "low"  -> bd(1.15); // düşük risk → daha yüksek teminat
            case "high" -> bd(0.85); // yüksek risk → bir miktar düşür
            default     -> bd(1.00); // medium/unknown
        };
    }

    private BigDecimal coverageVehicleFactor(Vehicle v) {
        if (v == null) return bd(1.00);
        BigDecimal f = bd(1.00);

        UsageType usage = v.getUsage();
        if (usage != null) {
            switch (usage) {
                case COMMERCIAL -> f = f.multiply(bd(0.95));
                case TAXI       -> f = f.multiply(bd(0.90));
                default -> { }
            }
        }

        FuelType fuel = v.getFuelType();
        if (fuel == FuelType.ELECTRIC) {
            f = f.multiply(bd(1.05)); // elektrikliye küçük bonus
        }

        return f;
    }

    /* ---------- Strateji anahtarını çöz ---------- */

    private String resolveStrategyKey(InsuranceCompany c) {
        // 1) code varsa doğrudan kullan
        String code = safe(c.getCode());
        if (!code.isBlank()) {
            if (code.startsWith("ECO")) return "ECO";
            if (code.startsWith("PRM")) return "PRM";
            if (code.startsWith("PRF")) return "PRF";
            if (code.startsWith("DNG")) return "DNG";
        }
        // 2) isim/id ile deterministik “sepet”e dağıt
        int bucket = Math.abs(Objects.hash(safe(c.getName()), safe(c.getId()))) % 4;
        return switch (bucket) {
            case 0 -> "ECO";
            case 1 -> "DNG";
            case 2 -> "PRF";
            default -> "PRM";
        };
    }

    private static BigDecimal stepRound(BigDecimal value, BigDecimal step) {
        if (step == null || BigDecimal.ZERO.compareTo(step) == 0) return value.setScale(0, RoundingMode.HALF_UP);
        BigDecimal[] div = value.divideAndRemainder(step);
        BigDecimal half = step.divide(bd(2), RoundingMode.HALF_UP);
        return (div[1].compareTo(half) >= 0)
                ? div[0].add(bd(1)).multiply(step)
                : div[0].multiply(step);
    }

    /* ---------- Util ---------- */

    private static BigDecimal toBD(Number n) {
        if (n == null) return bd(0);
        return bd(n.doubleValue());
    }
    private static BigDecimal bd(double v) { return BigDecimal.valueOf(v); }
    private static BigDecimal bd(long v)   { return BigDecimal.valueOf(v); }

    // OVERLOAD: UUID kabul eden safe
    private static String safe(UUID u) { return u == null ? "" : u.toString().toUpperCase(Locale.ROOT); }
    private static String safe(String s) { return s == null ? "" : s.trim().toUpperCase(Locale.ROOT); }

    private record CompanyStrategy(
            BigDecimal companyFactor,
            BigDecimal discountRate,
            BigDecimal maxDiscount,
            BigDecimal coverageBase,
            BigDecimal coverageMultiplier
    ) {}
}
