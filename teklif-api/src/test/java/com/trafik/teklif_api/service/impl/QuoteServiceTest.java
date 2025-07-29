// Dosya: src/test/java/com/trafik/teklif_api/service/impl/QuoteServiceTest.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    @Mock
    private QuoteRepository quoteRepo;

    @InjectMocks
    private QuoteServiceImpl service;

    // --- Yardımcı Veri Üreticileri ---
    private CreateQuoteRequest validRequest() {
        return new CreateQuoteRequest(42L, 5, 2500.0);
    }

    private Quote sampleQuote() {
        Quote q = new Quote();
        q.setId(1L);
        q.setCustomerId(42L);
        q.setRiskScore(5);
        q.setPremiumAmount(BigDecimal.valueOf(2500.0));
        q.setStatus(QuoteStatus.PENDING);
        q.setUniqueRefNo("REF-1");
        q.setCreatedAt(LocalDateTime.of(2025, 1, 1, 12, 0));
        return q;
    }

    @Test
    void createQuote_givenValidRequest_returnsQuoteResponse() {
        // Given
        CreateQuoteRequest req = validRequest();
        Quote saved = sampleQuote();
        when(quoteRepo.save(any(Quote.class))).thenAnswer(inv -> {
            Quote arg = inv.getArgument(0);
            arg.setId(saved.getId());
            arg.setUniqueRefNo(saved.getUniqueRefNo());
            arg.setCreatedAt(saved.getCreatedAt());
            return arg;
        });

        // When
        QuoteResponse res = service.create(req);

        // Then
        assertNotNull(res);
        assertEquals(saved.getId(), res.id());
        assertEquals(saved.getCustomerId(), res.customerId());
        assertEquals(saved.getRiskScore(), res.riskScore());
        assertEquals(saved.getPremiumAmount(), res.premiumAmount());
        assertEquals(saved.getStatus(), res.status());
        assertEquals(saved.getUniqueRefNo(), res.uniqueRefNo());
        assertEquals(saved.getCreatedAt(), res.createdAt());
    }

    @Test
    void createQuote_whenRepoThrows_throwsRuntimeException() {
        // Given
        when(quoteRepo.save(any(Quote.class))).thenThrow(new RuntimeException("DB error"));

        // When / Then
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.create(validRequest()));
        assertTrue(ex.getMessage().contains("DB error"));
    }

    @Test
    void getAll_givenQuotes_returnsMappedResponses() {
        // Given
        Quote q = sampleQuote();
        Page<Quote> page = new PageImpl<>(List.of(q));
        when(quoteRepo.findAll(any(PageRequest.class))).thenReturn(page);

        // When
        List<QuoteResponse> list = service.getAll(0, 1);

        // Then
        assertNotNull(list);
        assertEquals(1, list.size());
        QuoteResponse res = list.get(0);
        assertEquals(q.getId(), res.id());
    }

    @Test
    void getAll_whenRepoThrows_throwsRuntimeException() {
        // Given
        when(quoteRepo.findAll(any(PageRequest.class))).thenThrow(new RuntimeException("DB error"));

        // When / Then
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.getAll(0, 1));
        assertTrue(ex.getMessage().contains("DB error"));
    }

    @Test
    void getRecent_givenQuotes_returnsMappedResponses() {
        // Given
        Quote q = sampleQuote();
        Page<Quote> page = new PageImpl<>(List.of(q));
        when(quoteRepo.findAll(any(PageRequest.class))).thenReturn(page);

        // When
        List<QuoteResponse> list = service.getRecent();

        // Then
        assertNotNull(list);
        assertEquals(1, list.size());
    }

    @Test
    void getRecent_whenRepoThrows_throwsRuntimeException() {
        // Given
        when(quoteRepo.findAll(any(PageRequest.class))).thenThrow(new RuntimeException("DB error"));

        // When / Then
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.getRecent());
        assertTrue(ex.getMessage().contains("DB error"));
    }
}