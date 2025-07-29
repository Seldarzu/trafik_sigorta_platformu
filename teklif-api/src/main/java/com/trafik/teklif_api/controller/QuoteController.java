package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {
    private final QuoteService service;

    @PostMapping
    public QuoteResponse create(@Valid @RequestBody CreateQuoteRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<QuoteResponse> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(page, size);
    }

    @GetMapping("/recent")
    public List<QuoteResponse> recent() {
        return service.getRecent();
    }
}
