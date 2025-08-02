package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;

import java.util.List;

public interface QuoteService {
    QuoteResponse create(CreateQuoteRequest request);
    List<QuoteResponse> getAll(int page, int size);
    List<QuoteResponse> getRecent();
}
