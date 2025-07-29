// Dosya: src/main/java/com/trafik/teklif_api/service/QuoteService.java
package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import java.util.List;

public interface QuoteService {
    /**
     * Yeni bir teklif oluşturur.
     */
    QuoteResponse create(CreateQuoteRequest request);

    /**
     * Sayfalı teklif listesi döner.
     */
    List<QuoteResponse> getAll(int page, int size);

    /**
     * En son oluşturulan tekliflerden bir liste döner (örneğin son 5).
     */
    List<QuoteResponse> getRecent();
}
