// src/main/java/com/trafik/teklif_api/controller/PolicyController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.dto.policy.CreatePolicyFromQuoteRequest;
import com.trafik.teklif_api.entity.*;
import com.trafik.teklif_api.model.enums.PolicyStatus;
import com.trafik.teklif_api.model.enums.QuoteStatus;
import com.trafik.teklif_api.repository.*;
import com.trafik.teklif_api.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService service;

    // Repo tabanlı ek akışlar
    private final PolicyRepository repo;
    private final QuoteRepository quoteRepo; // Quote id: String
    private final InsuranceCompanyRepository companyRepo;
    private final PolicyInstallmentRepository installmentRepo;
    private final PolicyClaimRepository claimRepo;

    // ------------------- DTO tabanlı uçlar (service) -------------------

    @PostMapping
    public PolicyResponse create(@Valid @RequestBody CreatePolicyRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<PolicyResponse> list(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        return service.getAll(page, size);
    }

    @GetMapping("/{id}")
    public PolicyResponse getById(@PathVariable UUID id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Poliçe bulunamadı: " + id));
    }

    @PutMapping("/{id}")
    public PolicyResponse update(@PathVariable UUID id,
                                 @Valid @RequestBody UpdatePolicyRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PostMapping("/{id}/renew")
    public PolicyResponse renew(@PathVariable UUID id) {
        return service.renew(id);
    }

    @GetMapping("/expiring")
    public List<PolicyResponse> expiring() {
        return service.getExpiring();
    }

    @GetMapping("/search")
    public List<PolicyResponse> search(@RequestParam Optional<String> text,
                                       @RequestParam Optional<String> status,
                                       @RequestParam Optional<java.util.UUID> customerId,
                                       @RequestParam Optional<java.time.LocalDate> from,
                                       @RequestParam Optional<java.time.LocalDate> to,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        return service.search(text, status, customerId, from, to, page, size);
    }

    // ------------------- Ek işlevler (repo tabanlı) -------------------

    /**
     * Tekliften poliçe oluşturur — DTO (PolicyResponse) döner.
     * - Quote SOLD değilse:
     *    - Şirket seçilmediyse 400
     *    - Seçildiyse otomatik SOLD yap
     */
    @PostMapping("/create-from-quote")
    public PolicyResponse fromQuote(@Valid @RequestBody CreatePolicyFromQuoteRequest req) {
        // Quote id in DTO UUID gelmiş, bizde String; toString yeterli
        String quoteId = req.quoteId().toString();
        Quote q = quoteRepo.findById(quoteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teklif bulunamadı: " + quoteId));

        // Quote finalize/validation
        if (q.getStatus() != QuoteStatus.SOLD) {
            if (q.getSelectedCompanyId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select a company first.");
            }
            q.setStatus(QuoteStatus.SOLD);
            quoteRepo.save(q);
        }

        UUID companyId = q.getSelectedCompanyId();
        if (companyId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No company selected for the quote.");
        }

        Policy p = new Policy();
        p.setQuote(q);
        p.setCustomer(q.getCustomer());
        p.setCompany(companyRepo.findById(companyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found: " + companyId)));
        p.setAgent(q.getAgent());
        p.setVehicle(q.getVehicle());
        p.setDriver(q.getDriver());

        p.setPolicyNumber("POL" + java.time.LocalDate.now().toString().replace("-", "")
                + UUID.randomUUID().toString().substring(0, 6).toUpperCase());

        p.setPremium(q.getPremium());
        p.setFinalPremium(q.getFinalPremium());
        p.setCoverageAmount(q.getCoverageAmount());

        // Başlangıç tarihi zorunlu — CreatePolicyFromQuoteRequest.startDate
        if (req.startDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startDate is required.");
        }
        p.setStartDate(req.startDate());
        p.setEndDate(req.startDate().plusYears(1));
        p.setStatus(PolicyStatus.ACTIVE);

        Policy saved = repo.save(p);
        return mapToResponse(saved);
    }

    /** Poliçe taksitleri (ENTITY) */
    @GetMapping("/{id}/installments")
    public List<PolicyInstallment> installments(@PathVariable UUID id) {
        return installmentRepo.findByPolicy_Id(id);
    }

    /** Taksit ekle (ENTITY) */
    @PostMapping("/{id}/installments")
    public PolicyInstallment addInstallment(@PathVariable UUID id,
                                            @RequestBody PolicyInstallment i) {
        i.setPolicy(repo.findById(id).orElseThrow());
        return installmentRepo.save(i);
    }

    /** Poliçe hasarları (ENTITY) */
    @GetMapping("/{id}/claims")
    public List<PolicyClaim> claims(@PathVariable UUID id) {
        return claimRepo.findByPolicy_Id(id);
    }

    /** Hasar ekle (ENTITY) */
    @PostMapping("/{id}/claims")
    public PolicyClaim addClaim(@PathVariable UUID id, @RequestBody PolicyClaim c) {
        c.setPolicy(repo.findById(id).orElseThrow());
        return claimRepo.save(c);
    }

    /** Poliçe iptal (ENTITY güncelleme) */
    @PostMapping("/{id}/cancel")
    public Policy cancel(@PathVariable UUID id) {
        Policy p = repo.findById(id).orElseThrow();
        p.setStatus(PolicyStatus.CANCELLED);
        return repo.save(p);
    }

    /* ------------ Controller içi küçük mapper: Entity -> DTO ------------ */
    private PolicyResponse mapToResponse(Policy p) {
        String quoteIdStr = (p.getQuote() != null) ? p.getQuote().getId() : null;
        UUID customerId = (p.getCustomer() != null) ? p.getCustomer().getId() : null;

        LocalDateTime startDt = p.getStartDate() != null ? p.getStartDate().atStartOfDay() : null;
        LocalDateTime endDt = p.getEndDate() != null ? p.getEndDate().atStartOfDay() : null;
        LocalDateTime created = p.getCreatedAt() != null ? p.getCreatedAt().toLocalDateTime() : null;

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
