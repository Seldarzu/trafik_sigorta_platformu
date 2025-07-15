package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.model.Customer;
import com.trafik.teklif_api.model.Quote;
import com.trafik.teklif_api.model.QuoteStatus;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;            // <<--- ekledik
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    @Mock
    private QuoteRepository quoteRepo;

    @Mock
    private CustomerRepository custRepo;

    @InjectMocks
    private QuoteService quoteService;

    @Test
    void createQuote_whenNoRiskOrPremiumProvided_usesDefaults() {
        // Arrange
        Long customerId = 42L;
        var customer = new Customer();
        customer.setId(customerId);
        when(custRepo.findById(customerId)).thenReturn(Optional.of(customer));

        when(quoteRepo.save(any(Quote.class))).thenAnswer(inv -> {
            var q = inv.getArgument(0, Quote.class);
            q.setId(100L);
            return q;
        });

        // Act
        var req  = new CreateQuoteRequest(customerId, null, null);
        var resp = quoteService.createQuote(req);

        // Assert
        assertEquals(100L,      resp.id());
        assertEquals(customerId, resp.customerId());
        assertEquals(50,        resp.riskScore());
        assertEquals(new BigDecimal("500"), resp.premiumAmount());
        assertEquals("PENDING", resp.status());
        assertNotNull(resp.uniqueRefNo());    // <<--- değişti
        assertNotNull(resp.createdAt());
    }

    @Test
    void createQuote_whenRiskAndPremiumProvided_usesGivenValues() {
        // Arrange
        Long customerId = 7L;
        var customer = new Customer();
        customer.setId(customerId);
        when(custRepo.findById(customerId)).thenReturn(Optional.of(customer));

        when(quoteRepo.save(any(Quote.class))).thenAnswer(inv -> {
            var q = inv.getArgument(0, Quote.class);
            q.setId(200L);
            return q;
        });

        // Act
        var req  = new CreateQuoteRequest(customerId, 20, 123.45);
        var resp = quoteService.createQuote(req);

        // Assert
        assertEquals(200L,              resp.id());
        assertEquals(20,                resp.riskScore());
        assertEquals(new BigDecimal("123.45"), resp.premiumAmount());
    }

    @Test
    void listAll_returnsMappedResponses() {
        // Arrange
        var c1 = new Customer(); c1.setId(1L);
        var q1 = new Quote();
        q1.setId(10L);
        q1.setCustomer(c1);
        q1.setRiskScore(5);
        q1.setPremiumAmount(new BigDecimal("50"));
        q1.setStatus(QuoteStatus.PENDING);
        q1.setRefNo("REF1");
        q1.setCreatedAt(LocalDateTime.of(2025,7,13,12,0));

        var c2 = new Customer(); c2.setId(2L);
        var q2 = new Quote();
        q2.setId(20L);
        q2.setCustomer(c2);
        q2.setRiskScore(8);
        q2.setPremiumAmount(new BigDecimal("80"));
        q2.setStatus(QuoteStatus.PENDING);
        q2.setRefNo("REF2");
        q2.setCreatedAt(LocalDateTime.of(2025,7,13,13,0));

        when(quoteRepo.findAll()).thenReturn(List.of(q1, q2));

        // Act
        var list = quoteService.listAll();

        // Assert
        assertEquals(2, list.size());

        var r1 = list.get(0);
        assertEquals(10L, r1.id());
        assertEquals(1L,  r1.customerId());
        assertEquals(5,   r1.riskScore());
        assertEquals(new BigDecimal("50"), r1.premiumAmount());
        assertEquals("REF1", r1.uniqueRefNo());   // <<--- değişti
        assertEquals(LocalDateTime.of(2025,7,13,12,0), r1.createdAt());

        var r2 = list.get(1);
        assertEquals(20L, r2.id());
        assertEquals(2L,  r2.customerId());
        assertEquals(8,   r2.riskScore());
        assertEquals(new BigDecimal("80"), r2.premiumAmount());
        assertEquals("REF2", r2.uniqueRefNo());   // <<--- değişti
        assertEquals(LocalDateTime.of(2025,7,13,13,0), r2.createdAt());
    }
}
