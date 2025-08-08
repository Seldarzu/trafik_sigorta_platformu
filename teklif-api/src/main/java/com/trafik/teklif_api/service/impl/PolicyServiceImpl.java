package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreatePolicyRequest;
import com.trafik.teklif_api.dto.PolicyResponse;
import com.trafik.teklif_api.dto.UpdatePolicyRequest;
import com.trafik.teklif_api.entity.Policy;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.PolicyStatus;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.PolicyService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepo;
    private final QuoteRepository quoteRepo;

    public PolicyServiceImpl(PolicyRepository policyRepo,
                             QuoteRepository quoteRepo) {
        this.policyRepo = policyRepo;
        this.quoteRepo  = quoteRepo;
    }

    @Override
    public PolicyResponse create(CreatePolicyRequest req) {
        // Teklifi bul
        Quote q = quoteRepo.findById(req.quoteId())
            .orElseThrow(() -> new RuntimeException("Teklif bulunamadı: " + req.quoteId()));

        // Poliçeyi oluştur
        Policy p = new Policy();
        p.setQuoteId(q.getId());
        p.setCustomerId(q.getCustomerId());
        p.setVehicleId(q.getVehicle().getId());
        p.setDriverId(q.getDriver().getId());
        p.setPolicyNumber("POL-" + UUID.randomUUID()); // unique numara

        // Tutarlar
        p.setPremiumAmount(q.getPremium());
        p.setFinalPremium(q.getFinalPremium());
        p.setCoverageAmount(q.getCoverageAmount());
        p.setTotalDiscount(q.getTotalDiscount());

        // Risk
        p.setRiskScore(q.getRiskScore());
        p.setRiskLevel(q.getRiskLevel());

        // Tarihler
        p.setStartDate(req.startDate());
        p.setEndDate(req.endDate());

        // Diğer alanlar
        p.setIsAutoRenewal(Boolean.FALSE);
        p.setStatus(PolicyStatus.ACTIVE); // Converter varsa DB'ye 'active' gider
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());

        Policy saved = policyRepo.save(p);
        return map(saved);
    }

    @Override
    public List<PolicyResponse> getAll(int page, int size) {
        Page<Policy> p = policyRepo.findAll(
            PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return p.stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public Optional<PolicyResponse> getById(UUID id) {
        return policyRepo.findById(id).map(this::map);
    }

    @Override
    public PolicyResponse update(UUID id, UpdatePolicyRequest req) {
        Policy updated = policyRepo.findById(id)
            .map(p -> {
                if (req.endDate() != null) {
                    p.setEndDate(req.endDate());
                }
                if (req.status() != null) {
                    p.setStatus(req.status());
                }
                p.setUpdatedAt(LocalDateTime.now());
                return policyRepo.save(p);
            })
            .orElseThrow(() -> new RuntimeException("Poliçe bulunamadı: " + id));
        return map(updated);
    }

    @Override
    public void delete(UUID id) {
        policyRepo.deleteById(id);
    }

    @Override
    public PolicyResponse renew(UUID id) {
        Policy p = policyRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Poliçe bulunamadı: " + id));
        p.setEndDate(p.getEndDate().plusYears(1));
        p.setStatus(PolicyStatus.ACTIVE);
        p.setUpdatedAt(LocalDateTime.now());
        return map(policyRepo.save(p));
    }

    @Override
    public List<PolicyResponse> getExpiring() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime soon = now.plusDays(30);
        return policyRepo.findByEndDateBetween(now, soon)
            .stream()
            .map(this::map)
            .collect(Collectors.toList());
    }

    @Override
    public List<PolicyResponse> search(Optional<UUID> customerId,
                                       Optional<LocalDate> from,
                                       Optional<LocalDate> to,
                                       int page, int size) {

        Specification<Policy> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            customerId.ifPresent(id -> preds.add(cb.equal(root.get("customerId"), id)));
            from.ifPresent(d -> preds.add(cb.greaterThanOrEqualTo(root.get("startDate"), d.atStartOfDay())));
            to.ifPresent(d -> preds.add(cb.lessThanOrEqualTo(root.get("endDate"), d.atTime(23, 59, 59))));
            return cb.and(preds.toArray(new Predicate[0]));
        };

        Page<Policy> p = policyRepo.findAll(
            spec,
            PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return p.stream().map(this::map).collect(Collectors.toList());
    }

    private PolicyResponse map(Policy p) {
        return new PolicyResponse(
            p.getId(),
            p.getQuoteId(),
            p.getCustomerId(),
            p.getPolicyNumber(),
            p.getFinalPremium(),
            p.getStartDate(),
            p.getEndDate(),
            p.getStatus(),
            p.getCreatedAt()
        );
    }
}
