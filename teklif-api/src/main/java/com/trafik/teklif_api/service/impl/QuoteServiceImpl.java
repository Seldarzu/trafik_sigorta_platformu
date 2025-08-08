package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.PolicyService;
import com.trafik.teklif_api.service.QuoteService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepo;
    private final PolicyService  policyService;

    public QuoteServiceImpl(QuoteRepository quoteRepo,
                            PolicyService policyService) {
        this.quoteRepo     = quoteRepo;
        this.policyService = policyService;
    }

    @Override
    public QuoteResponse create(CreateQuoteRequest req) {
        Quote q = new Quote();
        q.setId(UUID.randomUUID().toString());
        q.setCustomerId(req.customerId());

        Vehicle v = new Vehicle();
        v.setPlateNumber(req.vehicle().plateNumber());
        v.setBrand(req.vehicle().brand());
        v.setModel(req.vehicle().model());
        v.setYear(req.vehicle().year());
        q.setVehicle(v);

        Driver d = new Driver();
        d.setFirstName(req.driver().firstName());
        d.setLastName(req.driver().lastName());
        d.setTcNumber(req.driver().tcNumber());
        d.setBirthDate(req.driver().birthDate());
        d.setLicenseDate(req.driver().licenseDate());
        d.setGender(req.driver().gender());
        d.setMaritalStatus(req.driver().maritalStatus());
        d.setEducation(req.driver().education());
        d.setProfession(req.driver().profession());
        d.setHasAccidents(req.driver().hasAccidents());
        d.setAccidentCount(req.driver().accidentCount());
        d.setHasViolations(req.driver().hasViolations());
        d.setViolationCount(req.driver().violationCount());
        q.setDriver(d);

        BigDecimal prem = BigDecimal.valueOf(req.premiumAmount());
        q.setPremium(prem);
        q.setCoverageAmount(prem);
        q.setFinalPremium(prem);
        q.setTotalDiscount(BigDecimal.ZERO);
        q.setRiskScore(req.riskScore());
        q.setRiskLevel("medium");
        q.setStatus(QuoteStatus.PENDING);

        OffsetDateTime now = OffsetDateTime.now();
        q.setValidUntil(now.plusDays(30));
        q.setCreatedAt(now);

        Quote saved = quoteRepo.save(q);
        return mapToResponse(saved);
    }

    @Override
    public List<QuoteResponse> getAll(int page, int size) {
        Page<Quote> p = quoteRepo.findAll(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return p.stream().map(this::mapToResponse).toList();
    }

    @Override
    public Optional<QuoteResponse> getById(String id) {
        return quoteRepo.findById(id).map(this::mapToResponse);
    }

    @Override
    public Optional<QuoteResponse> update(String id, UpdateQuoteRequest req) {
        return quoteRepo.findById(id)
            .map(q -> {
                q.setCustomerId(req.customerId());
                q.setRiskScore(req.riskScore());

                Vehicle v = q.getVehicle();
                v.setPlateNumber(req.vehicle().plateNumber());
                v.setBrand(req.vehicle().brand());
                v.setModel(req.vehicle().model());
                v.setYear(req.vehicle().year());
                q.setVehicle(v);

                Driver d = q.getDriver();
                d.setFirstName(req.driver().firstName());
                d.setLastName(req.driver().lastName());
                d.setTcNumber(req.driver().tcNumber());
                d.setBirthDate(req.driver().birthDate());
                d.setLicenseDate(req.driver().licenseDate());
                q.setDriver(d);

                BigDecimal prem = BigDecimal.valueOf(req.premiumAmount());
                q.setPremium(prem);
                q.setCoverageAmount(prem);
                q.setFinalPremium(prem);

                return mapToResponse(quoteRepo.save(q));
            });
    }

    @Override
    public void delete(String id) {
        quoteRepo.deleteById(id);
    }

    @Override
    public Optional<PolicyResponse> convert(String quoteId) {
        return quoteRepo.findById(quoteId)
            .map(q -> {
                OffsetDateTime now = OffsetDateTime.now();
                CreatePolicyRequest req = new CreatePolicyRequest(
                    q.getCustomerId(),
                    q.getId(),
                    q.getVehicle().getId(),
                    q.getDriver().getId(),
                    now.toLocalDateTime(),
                    now.plusYears(1).toLocalDateTime(),
                    null,
                    null,
                    q.getPremium(),
                    q.getFinalPremium(),
                    q.getCoverageAmount(),
                    false,
                    null,
                    q.getRiskScore(),
                    q.getRiskLevel(),
                    q.getTotalDiscount(),
                    null
                );
                return policyService.create(req);
            });
    }

    @Override
    public List<QuoteResponse> search(
        Optional<String>          customerName,
        Optional<java.time.LocalDate> from,
        Optional<java.time.LocalDate> to,
        int                       page,
        int                       size
    ) {
        Specification<Quote> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            // customerName ile driver.firstName/lastName üzerinde LIKE
            customerName.ifPresent(name -> {
                Join<Quote, ?> driverJoin = root.join("driver");
                String pattern = "%" + name.toLowerCase() + "%";
                preds.add(cb.or(
                    cb.like(cb.lower(driverJoin.get("firstName")), pattern),
                    cb.like(cb.lower(driverJoin.get("lastName")), pattern)
                ));
            });

            from.ifPresent(d ->
                preds.add(cb.greaterThanOrEqualTo(root.get("createdAt"), d.atStartOfDay()))
            );
            to.ifPresent(d ->
                preds.add(cb.lessThanOrEqualTo(root.get("createdAt"), d.atTime(23,59,59)))
            );

            return cb.and(preds.toArray(new Predicate[0]));
        };

        Page<Quote> p = quoteRepo.findAll(
            spec,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return p.stream().map(this::mapToResponse).toList();
    }

    private QuoteResponse mapToResponse(Quote q) {
        return new QuoteResponse(
            q.getId(),
            q.getCustomerId(),
            q.getRiskScore(),
            q.getPremium(),
            q.getCoverageAmount(),
            q.getFinalPremium(),
            q.getTotalDiscount(),
            q.getRiskLevel(),
            q.getStatus(),
            q.getValidUntil(),
            q.getCreatedAt()
        );
    }
}
