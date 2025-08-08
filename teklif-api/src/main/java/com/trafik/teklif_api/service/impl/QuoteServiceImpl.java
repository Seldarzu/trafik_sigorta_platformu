package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.repository.VehicleRepository;
import com.trafik.teklif_api.service.PolicyService;
import com.trafik.teklif_api.service.QuoteService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepo;
    private final PolicyService policyService;
    private final DriverRepository driverRepo;
    private final VehicleRepository vehicleRepo;

    public QuoteServiceImpl(QuoteRepository quoteRepo,
                            PolicyService policyService,
                            DriverRepository driverRepo,
                            VehicleRepository vehicleRepo) {
        this.quoteRepo = quoteRepo;
        this.policyService = policyService;
        this.driverRepo = driverRepo;
        this.vehicleRepo = vehicleRepo;
    }

    // ---------- CREATE (UPSERT driver & vehicle) ----------
    @Override
    @Transactional
    public QuoteResponse create(CreateQuoteRequest req) {
        // 1) DRIVER UPSERT (tc_number benzersiz)
        Driver driver = driverRepo.findByTcNumber(req.driver().tcNumber())
                .map(existing -> applyDriver(existing, req.driver()))
                .orElseGet(() -> applyDriver(new Driver(), req.driver()));
        // TC her durumda setli kalsın
        driver.setTcNumber(req.driver().tcNumber());
        driver = driverRepo.save(driver);

        // 2) VEHICLE UPSERT (plate_number benzersiz)
        Vehicle vehicle = vehicleRepo.findByPlateNumber(req.vehicle().plateNumber())
                .map(existing -> applyVehicle(existing, req.vehicle()))
                .orElseGet(() -> applyVehicle(new Vehicle(), req.vehicle()));
        vehicle.setPlateNumber(req.vehicle().plateNumber());
        vehicle = vehicleRepo.save(vehicle);

        // 3) QUOTE oluştur
        Quote q = new Quote();
        q.setId(UUID.randomUUID().toString());
        q.setCustomerId(req.customerId());

        // ilişkiler
        q.setDriver(driver);
        q.setVehicle(vehicle);

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

    // mevcut driver kaydını dto’ya göre güncelle
    private Driver applyDriver(Driver target, CreateDriverRequest d) {
        target.setFirstName(d.firstName());
        target.setLastName(d.lastName());
        target.setBirthDate(d.birthDate());
        target.setLicenseDate(d.licenseDate());
        target.setGender(d.gender());
        target.setMaritalStatus(d.maritalStatus());
        target.setEducation(d.education());
        target.setProfession(d.profession());
        target.setHasAccidents(Boolean.TRUE.equals(d.hasAccidents()));
        target.setAccidentCount(Boolean.TRUE.equals(d.hasAccidents())
                ? (d.accidentCount() == null ? 1 : d.accidentCount())
                : 0);
        target.setHasViolations(Boolean.TRUE.equals(d.hasViolations()));
        target.setViolationCount(Boolean.TRUE.equals(d.hasViolations())
                ? (d.violationCount() == null ? 1 : d.violationCount())
                : 0);
        return target;
    }

  private Vehicle applyVehicle(Vehicle target, CreateVehicleRequest v) {
    target.setBrand(v.brand());
    target.setModel(v.model());
    target.setYear(v.year());
    target.setEngineSize(v.engineSize());
    target.setFuelType(v.fuelType());
    target.setUsage(v.usage());         
    target.setCityCode(v.cityCode());
    return target;
}

    // ---------- LIST ----------
    @Override
    public List<QuoteResponse> getAll(int page, int size) {
        Page<Quote> p = quoteRepo.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return p.stream().map(this::mapToResponse).toList();
    }

    // ---------- GET ----------
    @Override
    public Optional<QuoteResponse> getById(String id) {
        return quoteRepo.findById(id).map(this::mapToResponse);
    }

    // ---------- UPDATE ----------
    @Override
    @Transactional
    public Optional<QuoteResponse> update(String id, UpdateQuoteRequest req) {
        return quoteRepo.findById(id).map(q -> {
            q.setCustomerId(req.customerId());
            q.setRiskScore(req.riskScore());

            // quote üzerindeki driver/vehicle güncelle (yeni tc/plaka verilirse upsert yapmak isterseniz aynı create mantığı eklenebilir)
            Vehicle v = q.getVehicle();
            v.setPlateNumber(req.vehicle().plateNumber());
            v.setBrand(req.vehicle().brand());
            v.setModel(req.vehicle().model());
            v.setYear(req.vehicle().year());

            Driver d = q.getDriver();
            d.setFirstName(req.driver().firstName());
            d.setLastName(req.driver().lastName());
            d.setTcNumber(req.driver().tcNumber());
            d.setBirthDate(req.driver().birthDate());
            d.setLicenseDate(req.driver().licenseDate());

            BigDecimal prem = BigDecimal.valueOf(req.premiumAmount());
            q.setPremium(prem);
            q.setCoverageAmount(prem);
            q.setFinalPremium(prem);

            return mapToResponse(quoteRepo.save(q));
        });
    }

    // ---------- DELETE ----------
    @Override
    public void delete(String id) {
        quoteRepo.deleteById(id);
    }

    // ---------- CONVERT ----------
    @Override
    public Optional<PolicyResponse> convert(String quoteId) {
        return quoteRepo.findById(quoteId).map(q -> {
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

    // ---------- SEARCH ----------
    @Override
    public List<QuoteResponse> search(
            Optional<String> customerName,
            Optional<java.time.LocalDate> from,
            Optional<java.time.LocalDate> to,
            int page,
            int size
    ) {
        Specification<Quote> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            customerName.ifPresent(name -> {
                Join<Quote, ?> driverJoin = root.join("driver");
                String pattern = "%" + name.toLowerCase() + "%";
                preds.add(cb.or(
                        cb.like(cb.lower(driverJoin.get("firstName")), pattern),
                        cb.like(cb.lower(driverJoin.get("lastName")), pattern)
                ));
            });

            from.ifPresent(d -> preds.add(cb.greaterThanOrEqualTo(root.get("createdAt"), d.atStartOfDay())));
            to.ifPresent(d -> preds.add(cb.lessThanOrEqualTo(root.get("createdAt"), d.atTime(23, 59, 59))));

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
