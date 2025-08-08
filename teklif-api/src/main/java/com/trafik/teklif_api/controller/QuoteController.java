package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.QuoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
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

    @GetMapping("/{id}")
    public ResponseEntity<QuoteResponse> getById(@PathVariable String id) {
        return service.getById(id)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuoteResponse> update(
        @PathVariable String id,
        @Valid @RequestBody UpdateQuoteRequest req
    ) {
        return service.update(id, req)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<PolicyResponse> convert(@PathVariable String id) {
        return service.convert(id)
                      .map(p -> ResponseEntity.status(HttpStatus.CREATED).body(p))
                      .orElse(ResponseEntity.notFound().build());
    }

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
}
