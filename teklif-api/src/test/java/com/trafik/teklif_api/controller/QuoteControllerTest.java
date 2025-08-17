package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.TestSecurityConfig;
import com.trafik.teklif_api.dto.DriverSummary;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.dto.VehicleSummary;
import com.trafik.teklif_api.model.enums.QuoteStatus;
import com.trafik.teklif_api.repository.InsuranceCompanyRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.service.QuoteService;
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
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = QuoteController.class)
@Import(TestSecurityConfig.class)
class QuoteControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    // Service
    @MockBean QuoteService quoteService;

    // Controller’ın diğer bağımlılıkları (select-company için gerekli)
    @MockBean QuoteRepository quoteRepository;
    @MockBean InsuranceCompanyRepository insuranceCompanyRepository;

    private final UUID QID = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

    private QuoteResponse q(String status) {
        return new QuoteResponse(
                "Q-2025-0001",
                UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                70, "MEDIUM", QuoteStatus.valueOf(status),
                new BigDecimal("1000"), new BigDecimal("200000"),
                new BigDecimal("900"), new BigDecimal("100"),
                OffsetDateTime.now().plusDays(10), OffsetDateTime.now(),
                new VehicleSummary("Ford","Focus",2020,"34ABC123"),
                new DriverSummary("Ali","Kaya","ENGINEER",false,false),
                "ACME"
        );
    }

    @Test @WithMockUser
    void get_delete_finalize_history_duplicate_ok() throws Exception {
        // GET
        Mockito.when(quoteService.getById(eq(QID))).thenReturn(Optional.of(q("DRAFT")));
        mvc.perform(get("/api/quotes/{id}", QID))
           .andExpect(status().isOk())
           .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        // DELETE
        mvc.perform(delete("/api/quotes/{id}", QID))
           .andExpect(status().isNoContent());
        Mockito.verify(quoteService).delete(QID);

        // FINALIZE → SOLD
        Mockito.when(quoteService.finalizeQuote(eq(QID))).thenReturn(q("SOLD"));
        mvc.perform(post("/api/quotes/{id}/finalize", QID))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.status").value("SOLD"));

        // HISTORY
        Mockito.when(quoteService.history(eq(QID))).thenReturn(List.of(
                java.util.Map.of("event","CREATED"),
                java.util.Map.of("event","UPDATED")
        ));
        mvc.perform(get("/api/quotes/{id}/history", QID))
           .andExpect(status().isOk());

        // DUPLICATE
        Mockito.when(quoteService.duplicate(eq(QID))).thenReturn(q("DRAFT"));
        mvc.perform(post("/api/quotes/{id}/duplicate", QID))
           .andExpect(status().isOk());
    }
}
