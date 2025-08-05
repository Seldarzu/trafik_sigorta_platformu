package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.model.QuoteStatus;
//import com.trafik.teklif_api.model.PolicyStatus;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.QuoteService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepo;

    public QuoteServiceImpl(QuoteRepository quoteRepo) {
        this.quoteRepo = quoteRepo;
    }

    @Override
    public QuoteResponse create(CreateQuoteRequest req) {
        Quote q = new Quote();
        q.setCustomerId(req.customerId());
        q.setRiskScore(req.riskScore());
        q.setPremiumAmount(BigDecimal.valueOf(req.premiumAmount()));
        q.setStatus(QuoteStatus.PENDING);
        q.setUniqueRefNo(UUID.randomUUID().toString());
        q.setCreatedAt(LocalDateTime.now());

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

        return mapToResponse( quoteRepo.save(q) );
    }

    @Override
    public List<QuoteResponse> getAll(int page, int size) {
        Page<Quote> p = quoteRepo.findAll(
            PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return p.stream().map(this::mapToResponse).toList();
    }

    @Override
    public Optional<QuoteResponse> getById(UUID id) {
        return quoteRepo.findById(id)
                        .map(this::mapToResponse);
    }

    @Override
    public Optional<QuoteResponse> update(UUID id, UpdateQuoteRequest req) {
        return quoteRepo.findById(id).map(existing -> {
            existing.setCustomerId(req.customerId());
            existing.setRiskScore(req.riskScore());
            existing.setPremiumAmount(BigDecimal.valueOf(req.premiumAmount()));
            // araç ve sürücü güncellemesi
            Vehicle v = existing.getVehicle();
            v.setPlateNumber(req.vehicle().plateNumber());
            v.setBrand(req.vehicle().brand());
            v.setModel(req.vehicle().model());
            v.setYear(req.vehicle().year());
            existing.setVehicle(v);
            Driver d = existing.getDriver();
            d.setFirstName(req.driver().firstName());
            d.setLastName(req.driver().lastName());
            d.setTcNumber(req.driver().tcNumber());
            d.setBirthDate(req.driver().birthDate());
            existing.setDriver(d);

            return mapToResponse( quoteRepo.save(existing) );
        });
    }

    @Override
    public void delete(UUID id) {
        quoteRepo.deleteById(id);
    }

/*    @Override
    public Optional<PolicyResponse> convert(UUID id) {
        // TODO: Gerçek poliçe oluşturma servisini entegre et!
        return quoteRepo.findById(id).map(q -> {
            var now = LocalDateTime.now();
            // TODO: Policy tablosuna gerçek kayıt atılacak
            // PolicyResponse response = policyService.createFromQuote(q);
            return new PolicyResponse(
                // (id) burada gerçek policy tablosu ID'si olmalı
                null,  // TODO: Gerçek policy id
                q.getId(),
                q.getCustomerId(),
                "POL-" + UUID.randomUUID().toString(),
                q.getPremiumAmount(),
                now,
                now.plusYears(1),
                //PolicyStatus.ACTIVE,
                now
            );
        });
    }*/
            @Override
        public Optional<PolicyResponse> convert(UUID id) {
            // TODO: Gerçek poliçe oluşturma servisini entegre et!
            return Optional.empty();  // Şimdilik boş dön, ileride dolduracaksın
        }//TODO:policy eklemeen önce hata vermesin diye boş dönen fonskiyon


    @Override
    public List<QuoteResponse> search(
        Optional<String> customerName,
        Optional<LocalDate> from,
        Optional<LocalDate> to,
        int page,
        int size
    ) {
        Specification<Quote> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            customerName.ifPresent(name ->
                predicates.add(cb.like(root.get("uniqueRefNo"), "%" + name + "%"))
            );
            from.ifPresent(d ->
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("createdAt"), d.atStartOfDay()
                ))
            );
            to.ifPresent(d ->
                predicates.add(cb.lessThanOrEqualTo(
                    root.get("createdAt"), d.atTime(23, 59, 59)
                ))
            );
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Quote> p = quoteRepo.findAll(
            spec,
            PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return p.stream().map(this::mapToResponse).toList();
    }

    private QuoteResponse mapToResponse(Quote q) {
        return new QuoteResponse(
            q.getId(),
            q.getCustomerId(),
            q.getRiskScore(),
            q.getPremiumAmount(),
            q.getStatus(),
            q.getUniqueRefNo(),
            q.getCreatedAt()
        );
    }
}
