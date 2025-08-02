// src/main/java/com/trafik/teklif_api/controller/QuoteController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.service.QuoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;

    /**
     * Yeni teklif oluşturur.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuoteResponse create(@Valid @RequestBody CreateQuoteRequest req) {
        return service.create(req);
    }

    /**
     * Sayfalı tüm teklifleri listeler.
     */
    @GetMapping
    public List<QuoteResponse> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(page, size);
    }

    /**
     * En yeni 10 teklifi döner.
     */
    @GetMapping("/recent")
    public List<QuoteResponse> recent() {
        return service.getRecent();
    }
}
