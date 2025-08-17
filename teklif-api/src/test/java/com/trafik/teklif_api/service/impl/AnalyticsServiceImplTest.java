package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.analytics.AnalyticsResponse;
import com.trafik.teklif_api.entity.Policy;
import com.trafik.teklif_api.entity.PolicyClaim;
import com.trafik.teklif_api.entity.Quote;
import com.trafik.teklif_api.model.enums.QuoteStatus;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.PolicyClaimRepository;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplTest {

    @Mock QuoteRepository quoteRepo;
    @Mock PolicyRepository policyRepo;
    @Mock CustomerRepository customerRepo;
    @Mock VehicleRepository vehicleRepo;
    @Mock PolicyClaimRepository claimRepo;

    @InjectMocks AnalyticsServiceImpl service;

    @Test
    void getSummary_ok() {
        when(quoteRepo.count()).thenReturn(10L);
        Policy p1 = new Policy(); p1.setFinalPremium(new BigDecimal("100"));
        Policy p2 = new Policy(); p2.setFinalPremium(new BigDecimal("200"));
        when(policyRepo.findAll()).thenReturn(List.of(p1, p2));
        when(policyRepo.count()).thenReturn(2L);

        var o = service.getSummary();
        assertThat(o.totalRevenue()).isEqualTo(300.0);
        assertThat(o.totalPolicies()).isEqualTo(2L);
        assertThat(o.conversionRate()).isEqualTo(20.0);
        assertThat(o.averagePremium()).isEqualTo(150.0);
    }

    @Test
    void getTopBrands_ok() {
        var v1 = new com.trafik.teklif_api.entity.Vehicle(); v1.setBrand("Ford");
        var v2 = new com.trafik.teklif_api.entity.Vehicle(); v2.setBrand("Ford");
        var v3 = new com.trafik.teklif_api.entity.Vehicle(); v3.setBrand("BMW");
        when(vehicleRepo.findAll()).thenReturn(List.of(v1, v2, v3));

        var list = service.getTopBrands("any");
        assertThat(list).hasSize(2);
        assertThat(list.get(0).brand()).isEqualTo("Ford");
    }

    @Test
    void performance_ok() {
        when(quoteRepo.count()).thenReturn(5L);
        when(policyRepo.count()).thenReturn(2L);
        var map = service.performance();
        assertThat(map.get("conversionRate")).isEqualTo(40.0);
    }

    @Test
    void revenue_ok() {
        Policy p1 = new Policy(); p1.setFinalPremium(new BigDecimal("100"));
        Policy p2 = new Policy(); p2.setFinalPremium(new BigDecimal("200"));
        when(policyRepo.findAll()).thenReturn(List.of(p1, p2));

        var map = service.revenue();
        assertThat(map.get("totalRevenue")).isEqualTo(300.0);
        assertThat(map.get("avgPremium")).isEqualTo(150.0);
    }

    @Test
    void claimsAnalysis_ok() {
        PolicyClaim c1 = new PolicyClaim(); c1.setClaimType("DAMAGE");
        PolicyClaim c2 = new PolicyClaim(); c2.setClaimType("DAMAGE");
        PolicyClaim c3 = new PolicyClaim(); c3.setClaimType("THEFT");
        when(claimRepo.findAll()).thenReturn(List.of(c1, c2, c3));

        var map = service.claimsAnalysis();
        assertThat(map.get("totalClaims")).isEqualTo(3L);
        assertThat(((java.util.Map<?,?>)map.get("claims")).get("DAMAGE")).isEqualTo(2L);
    }

    @Test
    void dashboard_ok() {
        when(customerRepo.count()).thenReturn(3L);
        when(policyRepo.count()).thenReturn(2L);

        Quote q1 = new Quote(); q1.setId("Q1"); q1.setStatus(QuoteStatus.PENDING);  q1.setCreatedAt(OffsetDateTime.parse("2025-01-02T00:00:00Z"));
        Quote q2 = new Quote(); q2.setId("Q2"); q2.setStatus(QuoteStatus.APPROVED); q2.setCreatedAt(OffsetDateTime.parse("2025-01-03T00:00:00Z"));
        when(quoteRepo.count()).thenReturn(2L);
        when(quoteRepo.findAll()).thenReturn(List.of(q1, q2));

        Policy p = new Policy(); p.setFinalPremium(new BigDecimal("100"));
        when(policyRepo.findAll()).thenReturn(List.of(p));

        AnalyticsResponse resp = service.dashboard();
        assertThat(resp.totalCustomers()).isEqualTo(3L);
        assertThat(resp.totalPolicies()).isEqualTo(2L);
        assertThat(resp.pendingQuotes()).isEqualTo(1L);
        assertThat(resp.approvedQuotes()).isEqualTo(1L);
        assertThat(resp.totalRevenue()).isEqualTo(100.0);
        assertThat(resp.recentQuotes()).hasSize(2);
    }
}
