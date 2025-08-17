package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.TestSecurityConfig;
import com.trafik.teklif_api.dto.DriverSummary;
import com.trafik.teklif_api.dto.PolicyResponse;
import com.trafik.teklif_api.dto.UpdatePolicyRequest;
import com.trafik.teklif_api.dto.VehicleSummary;
import com.trafik.teklif_api.model.enums.PaymentStatus;
import com.trafik.teklif_api.model.enums.PolicyStatus;
import com.trafik.teklif_api.repository.InsuranceCompanyRepository;
import com.trafik.teklif_api.repository.PolicyClaimRepository;
import com.trafik.teklif_api.repository.PolicyInstallmentRepository;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.PolicyService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PolicyController.class)
@Import(TestSecurityConfig.class)
class PolicyControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    // Service
    @MockBean PolicyService policyService;

    // Controller ctor’unda bulunan repo bağımlılıkları – bunları da mock’lamalıyız
    @MockBean PolicyRepository policyRepository;
    @MockBean QuoteRepository quoteRepository;
    @MockBean InsuranceCompanyRepository insuranceCompanyRepository;
    @MockBean PolicyInstallmentRepository policyInstallmentRepository;
    @MockBean PolicyClaimRepository policyClaimRepository;

    private final UUID PID = UUID.fromString("33333333-3333-3333-3333-333333333333");

    private PolicyResponse p() {
        return new PolicyResponse(
                PID,
                "Q-2025-0001",
                UUID.randomUUID(),
                "POL-0001",
                new BigDecimal("900"),
                new BigDecimal("200000"),
                new BigDecimal("100"),
                PolicyStatus.ACTIVE,
                PaymentStatus.PAID,
                LocalDateTime.now(),
                LocalDateTime.now().plusYears(1),
                LocalDateTime.now(),
                new VehicleSummary("Ford","Focus",2020,"34ABC123"),
                new DriverSummary("Ali","Kaya","ENGINEER",false,false),
                "ACME"
        );
    }

    @Test @WithMockUser
    void get_list_update_delete_renew_search_expiring_ok() throws Exception {
        // GET
        Mockito.when(policyService.getById(eq(PID))).thenReturn(Optional.of(p()));
        mvc.perform(get("/api/policies/{id}", PID))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.policyNumber").value("POL-0001"));

        // LIST
        Mockito.when(policyService.getAll(eq(0), eq(10))).thenReturn(List.of(p()));
        mvc.perform(get("/api/policies").param("page","0").param("size","10"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].policyNumber").value("POL-0001"));

        // UPDATE
        UpdatePolicyRequest upd = new UpdatePolicyRequest(LocalDateTime.now().plusYears(2), PolicyStatus.CANCELLED);
        Mockito.when(policyService.update(eq(PID), any(UpdatePolicyRequest.class))).thenReturn(p());
        mvc.perform(put("/api/policies/{id}", PID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(upd)))
           .andExpect(status().isOk());

        // DELETE (void -> 200 OK döner)
        mvc.perform(delete("/api/policies/{id}", PID))
           .andExpect(status().isOk());

        // RENEW
        Mockito.when(policyService.renew(eq(PID))).thenReturn(p());
        mvc.perform(post("/api/policies/{id}/renew", PID))
           .andExpect(status().isOk());

        // SEARCH
        Mockito.when(policyService.search(any(), any(), any(), any(), any(), eq(0), eq(10)))
               .thenReturn(List.of(p()));
        mvc.perform(get("/api/policies/search").param("page","0").param("size","10"))
           .andExpect(status().isOk());

        // EXPIRING
        Mockito.when(policyService.getExpiring()).thenReturn(List.of(p()));
        mvc.perform(get("/api/policies/expiring"))
           .andExpect(status().isOk());
    }
}
