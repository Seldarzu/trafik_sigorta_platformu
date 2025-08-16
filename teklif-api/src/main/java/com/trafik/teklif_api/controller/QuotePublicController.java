package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/quotes")
@RequiredArgsConstructor
public class QuotePublicController {

    private final QuoteService service;

    @GetMapping("/search")
    public List<QuoteResponse> search(
            @RequestParam Optional<String> customerName,
            @RequestParam Optional<LocalDate> from,
            @RequestParam Optional<LocalDate> to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.search(customerName, from, to, page, size);
    }

    @PostMapping("/{id}/select-company")
    public QuoteResponse selectCompanyPost(@PathVariable UUID id,
                                           @RequestParam("companyId") UUID companyId) {
        return service.selectCompany(id, companyId);
    }

    @GetMapping("/{id}/select-company")
    public QuoteResponse selectCompanyGet(@PathVariable UUID id,
                                          @RequestParam("companyId") UUID companyId) {
        return service.selectCompany(id, companyId);
    }
}
