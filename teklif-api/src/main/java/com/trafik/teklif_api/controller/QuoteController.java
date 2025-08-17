package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.PolicyResponse;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.dto.UpdateQuoteRequest;
import com.trafik.teklif_api.dto.SelectCompanyRequest;
import com.trafik.teklif_api.dto.VehicleSummary;
import com.trafik.teklif_api.dto.DriverSummary;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.entity.InsuranceCompany;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.repository.InsuranceCompanyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.QuoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;

    private final QuoteRepository quoteRepo;
    private final InsuranceCompanyRepository companyRepo;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuoteResponse create(@Valid @RequestBody CreateQuoteRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<QuoteResponse> list(
            @RequestParam(required = false) Integer limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (limit != null) {
            return service.getAll(0, limit);
        }
        return service.getAll(page, size);
    }

    @GetMapping("/{id}")
    public QuoteResponse get(@PathVariable UUID id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Quote bulunamadı: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuoteResponse> updatePartial(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateQuoteRequest req
    ) {
        return service.update(id, req)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PostMapping("/{id}/compare")
    public Map<String, Object> compare(@PathVariable UUID id) {
        return service.compare(id);
    }

    @GetMapping("/{id}/company-quotes")
    public List<Map<String, Object>> companyQuotes(@PathVariable UUID id) {
        return service.companyQuotes(id);
    }

    @PostMapping("/{id}/finalize")
    public QuoteResponse finalizeQuote(@PathVariable UUID id) {
        return service.finalizeQuote(id);
    }

    @GetMapping("/{id}/history")
    public List<Map<String, Object>> history(@PathVariable UUID id) {
        return service.history(id);
    }

    @PostMapping("/{id}/duplicate")
    public QuoteResponse duplicate(@PathVariable UUID id) {
        return service.duplicate(id);
    }

    @PostMapping("/bulk-create")
    public List<QuoteResponse> bulkCreate(@Valid @RequestBody List<CreateQuoteRequest> reqs) {
        return service.bulkCreate(reqs);
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<PolicyResponse> convert(@PathVariable UUID id) {
        return service.convert(id)
                .map(p -> ResponseEntity.status(HttpStatus.CREATED).body(p))
                .orElse(ResponseEntity.notFound().build());
    }

    /** PATCH body ile şirket seçimi – FE bunu kullanıyor. */
    @PatchMapping("/{quoteId}/select-company")
    public QuoteResponse selectCompany(@PathVariable String quoteId,
                                       @Valid @RequestBody SelectCompanyRequest req) {

        Quote q = quoteRepo.findById(quoteId)
                .orElseThrow(() -> new IllegalStateException("Teklif bulunamadı: " + quoteId));

        UUID companyId = req.companyId();
        InsuranceCompany comp = companyRepo.findById(companyId)
                .orElseThrow(() -> new IllegalStateException("Şirket bulunamadı: " + companyId));

        q.setSelectedCompanyId(companyId);
        q = quoteRepo.save(q);

        return toResponse(q, comp.getName());
    }

    private QuoteResponse toResponse(Quote q, String selectedCompanyName) {
        Vehicle v = q.getVehicle();
        Driver d  = q.getDriver();
        Customer c = q.getCustomer();

        VehicleSummary vehicleDto = (v == null) ? null :
                new VehicleSummary(v.getBrand(), v.getModel(), v.getYear(), v.getPlateNumber());

        DriverSummary driverDto = (d == null) ? null :
                new DriverSummary(d.getFirstName(), d.getLastName(), d.getProfession(),
                        d.isHasAccidents(), d.isHasViolations());

        return new QuoteResponse(
                q.getId(),
                c != null ? c.getId() : null,
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
                selectedCompanyName
        );
    }
}
