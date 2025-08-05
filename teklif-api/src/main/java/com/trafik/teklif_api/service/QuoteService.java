// src/main/java/com/trafik/teklif_api/service/QuoteService.java
package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.dto.UpdateQuoteRequest;
import com.trafik.teklif_api.dto.PolicyResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuoteService {
    QuoteResponse create(CreateQuoteRequest request);

    List<QuoteResponse> getAll(int page, int size);

    Optional<QuoteResponse> getById(UUID id);

    Optional<QuoteResponse> update(UUID id, UpdateQuoteRequest request);

    void delete(UUID id);

    Optional<PolicyResponse> convert(UUID id);

    List<QuoteResponse> search(
        Optional<String> customerName,
        Optional<LocalDate> from,
        Optional<LocalDate> to,
        int page,
        int size
    );
}
