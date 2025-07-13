package com.trafik.teklif_api;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.model.Customer;
import com.trafik.teklif_api.model.Quote;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.QuoteService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    @Mock
    private QuoteRepository quoteRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private QuoteService quoteService;

    @Test
    void createQuote_WhenNoRiskOrPremiumProvided_UsesDefaults() {
        // Arrange
        Long customerId = 42L;
        Customer customer = new Customer();
        customer.setId(customerId);
        when(customerRepository.findById(customerId))
            .thenReturn(Optional.of(customer));

        // Stub save: echo back the entity with ID set
        when(quoteRepository.save(any(Quote.class)))
            .thenAnswer(invocation -> {
                Quote q = invocation.getArgument(0);
                q.setId(100L);
                return q;
            });

        CreateQuoteRequest req = new CreateQuoteRequest();
        req.setCustomerId(customerId);
        // riskScore and premiumAmount left null

        // Act
        QuoteResponse resp = quoteService.createQuote(req);

        // Assert
        assertEquals(100L, resp.getId());
        assertEquals(customerId, resp.getCustomerId());
        assertEquals(50, resp.getRiskScore());  // default risk
        assertEquals(new BigDecimal("500"), resp.getPremiumAmount()); // 50 * 10
        assertEquals("PENDING", resp.getStatus());
        assertNotNull(resp.getUniqueRefNo());
        assertNotNull(resp.getCreatedAt());
    }

    @Test
    void createQuote_WhenRiskAndPremiumProvided_UsesGivenValues() {
        // Arrange
        Long customerId = 7L;
        Customer customer = new Customer();
        customer.setId(customerId);
        when(customerRepository.findById(customerId))
            .thenReturn(Optional.of(customer));

        when(quoteRepository.save(any(Quote.class)))
            .thenAnswer(invocation -> {
                Quote q = invocation.getArgument(0);
                q.setId(200L);
                return q;
            });

        CreateQuoteRequest req = new CreateQuoteRequest();
        req.setCustomerId(customerId);
        req.setRiskScore(20);
        req.setPremiumAmount(123.45);

        // Act
        QuoteResponse resp = quoteService.createQuote(req);

        // Assert
        assertEquals(200L, resp.getId());
        assertEquals(20, resp.getRiskScore());  
        assertEquals(new BigDecimal("123.45"), resp.getPremiumAmount());
    }

    @Test
    void listAll_ReturnsMappedResponses() {
        // Arrange
        Customer c1 = new Customer(); c1.setId(1L);
        Quote q1 = new Quote();
        q1.setId(10L);
        q1.setCustomer(c1);
        q1.setRiskScore(5);
        q1.setPremiumAmount(new BigDecimal("50"));
        q1.setStatus("OK");
        q1.setUniqueRefNo("REF1");
        q1.setCreatedAt(LocalDateTime.of(2025,7,13,12,0));

        Customer c2 = new Customer(); c2.setId(2L);
        Quote q2 = new Quote();
        q2.setId(20L);
        q2.setCustomer(c2);
        q2.setRiskScore(8);
        q2.setPremiumAmount(new BigDecimal("80"));
        q2.setStatus("OK");
        q2.setUniqueRefNo("REF2");
        q2.setCreatedAt(LocalDateTime.of(2025,7,13,13,0));

        when(quoteRepository.findAll())
            .thenReturn(List.of(q1, q2));

        // Act
        List<QuoteResponse> list = quoteService.listAll();

        // Assert
        assertEquals(2, list.size());

        QuoteResponse r1 = list.get(0);
        assertEquals(10L, r1.getId());
        assertEquals(1L, r1.getCustomerId());
        assertEquals(5, r1.getRiskScore());
        assertEquals(new BigDecimal("50"), r1.getPremiumAmount());
        assertEquals("REF1", r1.getUniqueRefNo());
        assertEquals(LocalDateTime.of(2025,7,13,12,0), r1.getCreatedAt());

        QuoteResponse r2 = list.get(1);
        assertEquals(20L, r2.getId());
        assertEquals(2L, r2.getCustomerId());
        assertEquals(8, r2.getRiskScore());
        assertEquals(new BigDecimal("80"), r2.getPremiumAmount());
        assertEquals("REF2", r2.getUniqueRefNo());
        assertEquals(LocalDateTime.of(2025,7,13,13,0), r2.getCreatedAt());
    }
}
