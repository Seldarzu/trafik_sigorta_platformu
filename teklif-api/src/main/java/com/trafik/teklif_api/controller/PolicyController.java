// src/main/java/com/trafik/teklif_api/controller/PolicyController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService service;

    @PostMapping
    public PolicyResponse create(@Valid @RequestBody CreatePolicyRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<PolicyResponse> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(page, size);
    }

    @GetMapping("/{id}")
    public PolicyResponse getById(@PathVariable UUID id) {
        return service.getById(id)
                      .orElseThrow(() -> new RuntimeException("Poliçe bulunamadı: " + id));
    }

    @PutMapping("/{id}")
    public PolicyResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody UpdatePolicyRequest req
    ) {
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
    public List<PolicyResponse> search(
        @RequestParam Optional<UUID> customerId,
        @RequestParam Optional<LocalDate> from,
        @RequestParam Optional<LocalDate> to,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return service.search(customerId, from, to, page, size);
    }
}
