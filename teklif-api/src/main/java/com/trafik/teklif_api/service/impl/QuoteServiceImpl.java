package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.*;
import com.trafik.teklif_api.model.enums.QuoteStatus;
import com.trafik.teklif_api.model.enums.RiskLevel;
import com.trafik.teklif_api.repository.*;
import com.trafik.teklif_api.service.QuoteService;
import com.trafik.teklif_api.util.PriceCalculator;
import com.trafik.teklif_api.util.RiskCalculator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepo;
    private final CustomerRepository customerRepo;
    private final VehicleRepository vehicleRepo;
    private final DriverRepository driverRepo;
    private final UserRepository userRepo;

    // >>> InsuranceCompanyRepository yerine CompanyRepository
    private final InsuranceCompanyRepository companyRepo;

    /* ---------------- Helpers ---------------- */
    private String sid(UUID id) { return id != null ? id.toString() : null; }

    private RiskLevel riskLevelFromScore(int score) {
        if (score < 40) return RiskLevel.LOW;
        if (score < 70) return RiskLevel.MEDIUM;
        return RiskLevel.HIGH;
    }

    private Map<String, Object> ev(String event, OffsetDateTime at) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("event", event);
        m.put("at", at);
        return m;
    }

    private QuoteResponse map(Quote q) {
        Vehicle v = q.getVehicle();
        Driver d  = q.getDriver();

        VehicleSummary vehicleDto = (v == null) ? null :
                new VehicleSummary(v.getBrand(), v.getModel(), v.getYear(), v.getPlateNumber());

        DriverSummary driverDto = (d == null) ? null :
                new DriverSummary(d.getFirstName(), d.getLastName(), d.getProfession(),
                        d.isHasAccidents(), d.isHasViolations());

        // seçili şirket adı (varsa) — sadece gösterim için
        String companyName = null;
        if (q.getSelectedCompanyId() != null) {
            companyName = companyRepo.findById(q.getSelectedCompanyId())
                    .map(InsuranceCompany::getName).orElse(null);
        }

        return new QuoteResponse(
                q.getId(),
                q.getCustomer() != null ? q.getCustomer().getId() : null,
                v != null ? v.getId() : null,
                d != null ? d.getId() : null,
                q.getAgent() != null ? q.getAgent().getId() : null,
                q.getRiskScore(),
                q.getRiskLevel() != null ? q.getRiskLevel().name() : null,
                q.getStatus(),
                q.getPremium(),
                q.getCoverageAmount(),
                q.getFinalPremium(),
                q.getTotalDiscount(),
                q.getValidUntil(),
                q.getCreatedAt(),
                vehicleDto,
                driverDto,
                companyName // <<< eklendi
        );
    }

    /* ---------------- Service methods ---------------- */

    @Override
    public QuoteResponse create(CreateQuoteRequest req) {
        UUID customerId = req.customerId();
        UUID vehicleId  = Objects.requireNonNull(req.vehicleId(), "vehicleId gerekli");
        UUID driverId   = Objects.requireNonNull(req.driverId(), "driverId gerekli");
        UUID agentId    = Objects.requireNonNull(req.agentId(),  "agentId gerekli");

        Customer customer = (customerId == null) ? null :
                customerRepo.findById(customerId)
                        .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + customerId));
        Vehicle vehicle = vehicleRepo.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Araç bulunamadı: " + vehicleId));
        Driver driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Sürücü bulunamadı: " + driverId));
        User agent = userRepo.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Acenta bulunamadı: " + agentId));

        int riskScore = (req.riskScore() != null) ? req.riskScore() : RiskCalculator.calculate(driver, vehicle);
        RiskLevel riskLevel = riskLevelFromScore(riskScore);

        double basePremium = (req.premiumAmount() != null) ? req.premiumAmount() : 1000.0;
        double coverage    = (req.coverageAmount() != null) ? req.coverageAmount() : 100_000.0;
        double premiumCalc = PriceCalculator.calculatePremium(basePremium, riskScore, coverage);

        Quote q = new Quote();
        q.setCustomer(customer);
        q.setVehicle(vehicle);
        q.setDriver(driver);
        q.setAgent(agent);

        q.setRiskScore(riskScore);
        q.setRiskLevel(riskLevel);
        q.setStatus(QuoteStatus.DRAFT);

        q.setPremium(BigDecimal.valueOf(premiumCalc));
        q.setCoverageAmount(BigDecimal.valueOf(coverage));
        q.setFinalPremium(BigDecimal.valueOf(premiumCalc));
        q.setTotalDiscount(BigDecimal.ZERO);

        q.setValidUntil(OffsetDateTime.now(ZoneOffset.UTC).plusDays(30));

        return map(quoteRepo.save(q));
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuoteResponse> getAll(int page, int size) {
        Page<Quote> p = quoteRepo.findAllBy(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return p.stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<QuoteResponse> getById(UUID id) {
        return quoteRepo.findById(sid(id)).map(this::map);
    }

    @Override
    public Optional<QuoteResponse> update(UUID id, UpdateQuoteRequest request) {
        return quoteRepo.findById(sid(id)).map(q -> {
            q.setRiskScore(request.riskScore());
            q.setRiskLevel(riskLevelFromScore(request.riskScore()));
            BigDecimal premium = BigDecimal.valueOf(request.premiumAmount());
            q.setPremium(premium);
            q.setFinalPremium(premium);
            return map(quoteRepo.save(q));
        });
    }

    @Override
    public void delete(UUID id) {
        quoteRepo.deleteById(sid(id));
    }

    @Override
    public Optional<PolicyResponse> convert(UUID id) {
        return Optional.empty();
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuoteResponse> search(Optional<String> customerName,
                                      Optional<java.time.LocalDate> from,
                                      Optional<java.time.LocalDate> to,
                                      int page,
                                      int size) {

        Specification<Quote> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            customerName.ifPresent(name -> {
                String pattern = "%" + name.toLowerCase(Locale.ROOT) + "%";
                Join<Quote, Customer> c = root.join("customer");
                Predicate byFirst = cb.like(cb.lower(c.get("firstName")), pattern);
                Predicate byLast  = cb.like(cb.lower(c.get("lastName")),  pattern);
                preds.add(cb.or(byFirst, byLast));
            });

            from.ifPresent(d -> preds.add(
                    cb.greaterThanOrEqualTo(root.get("createdAt"), d.atStartOfDay().atOffset(ZoneOffset.UTC))
            ));
            to.ifPresent(d -> preds.add(
                    cb.lessThanOrEqualTo(root.get("createdAt"), d.atTime(23,59,59).atOffset(ZoneOffset.UTC))
            ));

            return cb.and(preds.toArray(new Predicate[0]));
        };

        Page<Quote> p = quoteRepo.findAll(
                spec,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return p.stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> compare(UUID id) {
        Quote q = quoteRepo.findById(sid(id))
                .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("quoteId", q.getId());
        res.put("riskScore", q.getRiskScore());
        res.put("riskLevel", q.getRiskLevel() != null ? q.getRiskLevel().name() : null);
        res.put("premium", q.getPremium());
        res.put("finalPremium", q.getFinalPremium());
        res.put("coverageAmount", q.getCoverageAmount());
        return res;
    }
@Override
@Transactional(readOnly = true)
public List<Map<String, Object>> companyQuotes(UUID id) {
    Quote q = quoteRepo.findById(sid(id))
            .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));

    // Aktif şirketleri çek
    List<InsuranceCompany> companies = companyRepo.findByIsActiveTrue();
    if (companies == null || companies.isEmpty()) {
        // Hiç şirket yoksa mevcut değerlerden tek satır göstermek yerine boş liste gönder
        return List.of();
    }

    double basePremium = q.getPremium() != null ? q.getPremium().doubleValue() : 1000.0;
    double coverage    = q.getCoverageAmount() != null ? q.getCoverageAmount().doubleValue() : 100_000.0;
    int    risk        = q.getRiskScore() != null ? q.getRiskScore() : 50;

    Random rnd = new Random(Objects.hash(id, q.getCreatedAt())); // stabil dağılım için seed

    List<Map<String, Object>> out = new ArrayList<>();
    for (InsuranceCompany c : companies) {
        // Basit bir fiyat varyasyonu (örnek)
        double factor = 0.85 + (rnd.nextDouble() * 0.40); // 0.85–1.25 arası
        double premium = Math.max(250.0, basePremium * factor);
        // risk etkisi (hafif)
        premium = premium * (1.0 + (Math.max(0, risk - 50) * 0.002));

        double discount = premium * (0.05 * rnd.nextInt(4)); // %0, %5, %10, %15
        double finalPremium = Math.max(150.0, premium - discount);

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("quoteId", q.getId());
        row.put("companyId", c.getId());
        row.put("companyName", c.getName());
        row.put("premium", premium);
        row.put("finalPremium", finalPremium);
        row.put("coverageAmount", coverage); // teminatı sabit tutalım
        out.add(row);
    }

    return out;
}

    @Override
    public QuoteResponse selectCompany(UUID id, UUID companyId) {
        InsuranceCompany company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Şirket bulunamadı: " + companyId));

        Quote q = quoteRepo.findById(sid(id))
                .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));

        // 1) Quote'a yaz
        q.setSelectedCompanyId(companyId);
        quoteRepo.save(q);

        // 2) Müşteriye yaz (varsa)
        Customer cust = q.getCustomer();
        if (cust != null) {
            cust.setPreferredCompanyId(companyId);
            cust.setPreferredCompanyName(company.getName());
            customerRepo.save(cust);
        }

        return map(q);
    }

    @Override
    public QuoteResponse finalizeQuote(UUID id) {
        Quote q = quoteRepo.findById(sid(id))
                .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));

        if (q.getSelectedCompanyId() != null) {
            q.setStatus(QuoteStatus.SOLD);
        } else {
            q.setStatus(QuoteStatus.ACTIVE);
        }
        return map(quoteRepo.save(q));
    }

    @Override
    public List<Map<String, Object>> history(UUID id) {
        Quote q = quoteRepo.findById(sid(id))
                .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));

        List<Map<String, Object>> events = new ArrayList<>();
        events.add(ev("CREATED", q.getCreatedAt()));
        events.add(ev("STATUS:" + (q.getStatus() != null ? q.getStatus().name() : "UNKNOWN"), q.getUpdatedAt()));
        if (q.getSelectedCompanyId() != null) {
            events.add(ev("COMPANY_SELECTED:" + q.getSelectedCompanyId(), q.getUpdatedAt()));
        }
        return events;
    }

    @Override
    public QuoteResponse duplicate(UUID id) {
        Quote q = quoteRepo.findById(sid(id))
                .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));

        Quote copy = new Quote();
        copy.setCustomer(q.getCustomer());
        copy.setVehicle(q.getVehicle());
        copy.setDriver(q.getDriver());
        copy.setAgent(q.getAgent());

        copy.setPremium(q.getPremium());
        copy.setCoverageAmount(q.getCoverageAmount());
        copy.setFinalPremium(q.getFinalPremium());
        copy.setTotalDiscount(q.getTotalDiscount());

        copy.setRiskScore(q.getRiskScore());
        copy.setRiskLevel(q.getRiskLevel());
        copy.setStatus(QuoteStatus.DRAFT);
        copy.setValidUntil(OffsetDateTime.now(ZoneOffset.UTC).plusDays(30));
        copy.setSelectedCompanyId(null);

        return map(quoteRepo.save(copy));
    }

    @Override
    public List<QuoteResponse> bulkCreate(List<CreateQuoteRequest> requests) {
        List<QuoteResponse> out = new ArrayList<>();
        for (CreateQuoteRequest req : requests) {
            out.add(create(req));
        }
        return out;
    }
}
