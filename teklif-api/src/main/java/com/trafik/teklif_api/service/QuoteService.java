package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.PolicyResponse;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.dto.UpdateQuoteRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface QuoteService {

    QuoteResponse create(CreateQuoteRequest req);

    List<QuoteResponse> getAll(int page, int size);

    Optional<QuoteResponse> getById(UUID id);

    Optional<QuoteResponse> update(UUID id, UpdateQuoteRequest request);

    void delete(UUID id);

    Optional<PolicyResponse> convert(UUID id);

    List<QuoteResponse> search(Optional<String> customerName,
                                Optional<LocalDate> from,
                                Optional<LocalDate> to,
                                int page,
                                int size);

    Map<String, Object> compare(UUID id);

    List<Map<String, Object>> companyQuotes(UUID id);

    QuoteResponse selectCompany(UUID id, UUID companyId);

    QuoteResponse finalizeQuote(UUID id);

    List<Map<String, Object>> history(UUID id);

    QuoteResponse duplicate(UUID id);

    List<QuoteResponse> bulkCreate(List<CreateQuoteRequest> requests);
}
