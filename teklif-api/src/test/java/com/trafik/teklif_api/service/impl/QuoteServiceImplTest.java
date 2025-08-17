// src/test/java/com/trafik/teklif_api/service/impl/QuoteServiceImplTest.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.entity.*;
import com.trafik.teklif_api.model.enums.RiskLevel;
import com.trafik.teklif_api.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuoteServiceImplTest {

    @Mock QuoteRepository quoteRepo;
    @Mock CustomerRepository customerRepo;
    @Mock VehicleRepository vehicleRepo;
    @Mock DriverRepository driverRepo;
    @Mock UserRepository userRepo;
    @Mock InsuranceCompanyRepository companyRepo;

    @InjectMocks QuoteServiceImpl service;

    private UUID CUST_ID, VEH_ID, DRV_ID, AGT_ID;
    private Customer customer;
    private Vehicle vehicle;
    private Driver driver;
    private User agent;

    @BeforeEach
    void setup() {
        CUST_ID = UUID.randomUUID();
        VEH_ID  = UUID.randomUUID();
        DRV_ID  = UUID.randomUUID();
        AGT_ID  = UUID.randomUUID();

        customer = new Customer(); customer.setId(CUST_ID);
        vehicle  = new Vehicle();  vehicle.setId(VEH_ID);
        vehicle.setBrand("Ford"); vehicle.setModel("Focus"); vehicle.setYear(2020); vehicle.setPlateNumber("34ABC123");
        driver   = new Driver();   driver.setId(DRV_ID);
        driver.setFirstName("Ali"); driver.setLastName("Kaya"); driver.setProfession("ENG");
        agent    = new User();     agent.setId(AGT_ID);
    }

    private Quote persistedQuote(String id) {
        Quote q = new Quote();
        q.setId(id);
        q.setCustomer(customer);
        q.setVehicle(vehicle);
        q.setDriver(driver);
        q.setAgent(agent);
        q.setRiskScore(60);
        q.setRiskLevel(RiskLevel.MEDIUM);
        q.setPremium(new BigDecimal("1000"));
        q.setFinalPremium(new BigDecimal("950"));
        q.setCoverageAmount(new BigDecimal("200000"));
        q.setTotalDiscount(BigDecimal.ZERO);
        q.setCreatedAt(OffsetDateTime.parse("2025-01-01T00:00:00Z"));
        q.setValidUntil(OffsetDateTime.parse("2025-01-31T00:00:00Z"));
        return q;
    }

    @Test
    void create_ok() {
        when(customerRepo.findById(CUST_ID)).thenReturn(Optional.of(customer));
        when(vehicleRepo.findById(VEH_ID)).thenReturn(Optional.of(vehicle));
        when(driverRepo.findById(DRV_ID)).thenReturn(Optional.of(driver));
        when(userRepo.findById(AGT_ID)).thenReturn(Optional.of(agent));
        when(quoteRepo.save(any(Quote.class))).thenAnswer(inv -> {
            Quote q = inv.getArgument(0);
            q.setId("Q1");
            return q;
        });

        CreateQuoteRequest req = new CreateQuoteRequest(
                CUST_ID, VEH_ID, DRV_ID, AGT_ID,
                55, 1200.0, 150_000.0
        );

        var res = service.create(req);
        assertThat(res).isNotNull();
        verify(quoteRepo).save(any(Quote.class));
    }

    @Test
    void getAll_ok() {
        var page = new PageImpl<>(List.of(persistedQuote("Q1")));

        // Servisin gerçekten kullandığı imza:
        when(quoteRepo.findAllBy(any(Pageable.class))).thenReturn(page);

        var list = service.getAll(0, 10);

        assertThat(list).isNotNull();
        if (list instanceof Collection<?> col) {
            assertThat(col).hasSize(1);
        }
    }
}
