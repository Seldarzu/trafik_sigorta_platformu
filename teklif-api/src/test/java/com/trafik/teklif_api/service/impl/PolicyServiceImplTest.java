// src/test/java/com/trafik/teklif_api/service/impl/PolicyServiceImplTest.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreatePolicyRequest;
import com.trafik.teklif_api.dto.UpdatePolicyRequest;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.Policy;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.enums.PolicyStatus;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PolicyServiceImplTest {

    @Mock PolicyRepository policyRepo;
    @Mock QuoteRepository quoteRepo;

    @InjectMocks PolicyServiceImpl service;

    private Quote quote;

    @BeforeEach
    void init() {
        quote = new Quote();
        quote.setId("Q-1");
        Customer c = new Customer(); c.setId(UUID.randomUUID());
        quote.setCustomer(c);
        quote.setPremium(new BigDecimal("1000"));
        quote.setFinalPremium(new BigDecimal("950"));
        quote.setCoverageAmount(new BigDecimal("200000"));
    }

    @Test
    void create_ok() {
        when(quoteRepo.findById(anyString())).thenReturn(Optional.of(quote));
        when(policyRepo.save(any(Policy.class))).thenAnswer(inv -> {
            Policy p = inv.getArgument(0);
            p.setId(UUID.randomUUID());
            p.setStatus(PolicyStatus.ACTIVE);
            return p;
        });

        CreatePolicyRequest req = new CreatePolicyRequest(
                UUID.randomUUID(),                     // customerId
                "Q-1",                                 // quoteId
                UUID.randomUUID(),                     // vehicleId
                UUID.randomUUID(),                     // driverId
                LocalDateTime.of(2025,1,1,0,0),        // startDate
                LocalDateTime.of(2026,1,1,0,0),        // endDate
                null,                                  // agentId
                null,                                  // companyId
                new BigDecimal("1000.00"),             // premium          (NotNull)
                new BigDecimal("950.00"),              // finalPremium     (NotNull)
                new BigDecimal("200000.00"),           // coverageAmount   (NotNull)
                Boolean.TRUE,                          // isAutoRenewal    (NotNull)
                null,                                  // renewalDate
                70,                                    // riskScore
                "MEDIUM",                              // riskLevel
                new BigDecimal("50.00"),               // totalDiscount
                "{}"                                   // policyData
        );

        Object res = service.create(req);
        assertThat(res).isNotNull();
        verify(policyRepo).save(any(Policy.class));
    }

    @Test
    void getAll_ok() {
        when(policyRepo.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(new Policy())));
        Object list = service.getAll(0, 10);
        assertThat(list).isNotNull();
    }

    @Test
    void update_ok() {
        UUID id = UUID.randomUUID();
        Policy p = new Policy(); p.setId(id); p.setEndDate(LocalDate.of(2025,12,31));
        when(policyRepo.findById(id)).thenReturn(Optional.of(p));
        when(policyRepo.save(any(Policy.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdatePolicyRequest req = new UpdatePolicyRequest(
                LocalDateTime.of(2026,12,31,0,0),
                PolicyStatus.CANCELLED
        );

        Object res = service.update(id, req);
        assertThat(res).isNotNull();
        verify(policyRepo).save(any(Policy.class));
    }
}
