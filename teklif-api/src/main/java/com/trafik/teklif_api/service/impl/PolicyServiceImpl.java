// src/main/java/com/trafik/teklif_api/service/impl/PolicyServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreatePolicyRequest;
import com.trafik.teklif_api.dto.DriverSummary;
import com.trafik.teklif_api.dto.PolicyResponse;
import com.trafik.teklif_api.dto.UpdatePolicyRequest;
import com.trafik.teklif_api.dto.VehicleSummary;
import com.trafik.teklif_api.entity.Policy;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.enums.PolicyStatus;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.PolicyService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepo;
    private final QuoteRepository quoteRepo;

    /* ================== CREATE ================== */
    @Override
    public PolicyResponse create(CreatePolicyRequest req) {
        // Quote id: String (Quote entity id tipi String)
        String quoteId = Objects.requireNonNull(req.quoteId(), "quoteId zorunlu");
        Quote q = quoteRepo.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Teklif bulunamadı: " + quoteId));

        Policy p = new Policy();
        p.setQuote(q);
        p.setCustomer(q.getCustomer());

        // Poliçe no üret (istenirse başka strateji uygulanabilir)
        p.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        // Tarih dönüşümleri: DTO LocalDateTime -> Entity LocalDate
        LocalDate start = Objects.requireNonNull(req.startDate(), "startDate zorunlu").toLocalDate();
        LocalDate end   = Objects.requireNonNull(req.endDate(),   "endDate zorunlu").toLocalDate();
        p.setStartDate(start);
        p.setEndDate(end);

        // Tutarlar: DTO’dan geliyorsa onu al, yoksa Quote’tan
        p.setPremium(Objects.requireNonNullElse(req.premium(), q.getPremium()));
        p.setFinalPremium(Objects.requireNonNullElse(req.finalPremium(), q.getFinalPremium()));
        p.setCoverageAmount(Objects.requireNonNullElse(req.coverageAmount(), q.getCoverageAmount()));

        // Durum & zaman damgaları
        p.setStatus(PolicyStatus.ACTIVE);
        p.setCreatedAt(OffsetDateTime.now());
        p.setUpdatedAt(OffsetDateTime.now());

        return map(policyRepo.save(p));
    }

    /* ================== LIST (paged) ================== */
    @Override
    @Transactional(readOnly = true)
    public List<PolicyResponse> getAll(int page, int size) {
        Page<Policy> res = policyRepo.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return res.stream().map(this::map).collect(Collectors.toList());
    }

    /* ================== GET BY ID ================== */
    @Override
    @Transactional(readOnly = true)
    public Optional<PolicyResponse> getById(UUID id) {
        return policyRepo.findById(id).map(this::map);
    }

    /* ================== UPDATE ================== */
    @Override
    public PolicyResponse update(UUID id, UpdatePolicyRequest req) {
        Policy updated = policyRepo.findById(id)
                .map(p -> {
                    if (req.endDate() != null) {
                        p.setEndDate(req.endDate().toLocalDate()); // LDT -> LD
                    }
                    if (req.status() != null) {
                        p.setStatus(req.status());
                    }
                    p.setUpdatedAt(OffsetDateTime.now());
                    return policyRepo.save(p);
                })
                .orElseThrow(() -> new RuntimeException("Poliçe bulunamadı: " + id));
        return map(updated);
    }

    /* ================== DELETE ================== */
    @Override
    public void delete(UUID id) {
        policyRepo.deleteById(id);
    }

    /* ================== RENEW ================== */
    @Override
    public PolicyResponse renew(UUID id) {
        Policy p = policyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Poliçe bulunamadı: " + id));

        p.setEndDate(p.getEndDate().plusYears(1));
        p.setStatus(PolicyStatus.ACTIVE);
        p.setUpdatedAt(OffsetDateTime.now());
        return map(policyRepo.save(p));
    }

    /* ================== EXPIRING ================== */
    @Override
    @Transactional(readOnly = true)
    public List<PolicyResponse> getExpiring() {
        LocalDate today = LocalDate.now();
        LocalDate soon  = today.plusDays(30);

        Specification<Policy> spec = (root, query, cb) ->
                cb.between(root.get("endDate"), today, soon);

        return policyRepo.findAll(spec, Sort.by(Sort.Direction.ASC, "endDate"))
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    /* ================== SEARCH ================== */
   @Override
@Transactional(readOnly = true)
public List<PolicyResponse> search(Optional<String> text,
                                   Optional<String> status,
                                   Optional<UUID> customerId,
                                   Optional<LocalDate> from,
                                   Optional<LocalDate> to,
                                   int page,
                                   int size) {

    Specification<Policy> spec = (root, query, cb) -> {
        List<Predicate> preds = new ArrayList<>();

        customerId.ifPresent(cid -> preds.add(cb.equal(root.get("customer").get("id"), cid)));
        from.ifPresent(d -> preds.add(cb.greaterThanOrEqualTo(root.get("startDate"), d)));
        to.ifPresent(d   -> preds.add(cb.lessThanOrEqualTo(root.get("endDate"), d)));

        status.ifPresent(s -> {
            try {
                var st = com.trafik.teklif_api.model.enums.PolicyStatus.from(s);
                preds.add(cb.equal(root.get("status"), st));
            } catch (Exception ignored) {}
        });

        text.ifPresent(t -> {
            String like = "%" + t.toLowerCase() + "%";
            var vehJoin = root.join("vehicle", jakarta.persistence.criteria.JoinType.LEFT);
            var drvJoin = root.join("driver",  jakarta.persistence.criteria.JoinType.LEFT);
            var custJoin= root.join("customer",jakarta.persistence.criteria.JoinType.LEFT);

            var byPolicyNumber = cb.like(cb.lower(root.get("policyNumber")), like);
            var byPlate        = cb.like(cb.lower(vehJoin.get("plateNumber")), like);
            var byDriver       = cb.or(
                cb.like(cb.lower(drvJoin.get("firstName")), like),
                cb.like(cb.lower(drvJoin.get("lastName")), like)
            );
            var byCustomer     = cb.or(
                cb.like(cb.lower(custJoin.get("firstName")), like),
                cb.like(cb.lower(custJoin.get("lastName")), like)
            );
            preds.add(cb.or(byPolicyNumber, byPlate, byDriver, byCustomer));
        });

        return cb.and(preds.toArray(new Predicate[0]));
    };

    Page<Policy> res = policyRepo.findAll(
        spec,
        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
    );
    return res.stream().map(this::map).collect(Collectors.toList());
}

    /* ================== Mapper ================== */
   private PolicyResponse map(Policy p) {
    String quoteIdStr = (p.getQuote() != null) ? p.getQuote().getId() : null;
    UUID customerId   = (p.getCustomer() != null) ? p.getCustomer().getId() : null;

    LocalDateTime startDt = p.getStartDate() != null ? p.getStartDate().atStartOfDay() : null;
    LocalDateTime endDt   = p.getEndDate()   != null ? p.getEndDate().atStartOfDay()   : null;
    LocalDateTime created = p.getCreatedAt() != null ? p.getCreatedAt().toLocalDateTime() : null;

    // Özetler
    VehicleSummary v = null;
    if (p.getVehicle() != null) {
        var veh = p.getVehicle();
        v = new VehicleSummary(veh.getBrand(), veh.getModel(), veh.getYear(), veh.getPlateNumber());
    }
    DriverSummary d = null;
    if (p.getDriver() != null) {
        var dr = p.getDriver();
        d = new DriverSummary(dr.getFirstName(), dr.getLastName(), dr.getProfession(),
                dr.isHasAccidents(), dr.isHasViolations());
    }

    String companyName = (p.getCompany() != null) ? p.getCompany().getName() : null;

    return new PolicyResponse(
        p.getId(),
        quoteIdStr,
        customerId,
        p.getPolicyNumber(),

        p.getFinalPremium(),
        p.getCoverageAmount(),
        p.getTotalDiscount(),

        p.getStatus(),
        p.getPaymentStatus(),

        startDt,
        endDt,
        created,

        v,
        d,
        companyName
    );
}

}
