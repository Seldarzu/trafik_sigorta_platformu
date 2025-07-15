package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.dto.CreateQuoteRequest;
import com.trafik.teklif_api.dto.QuoteResponse;
import com.trafik.teklif_api.service.QuoteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuoteController.class)
class QuoteControllerTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper om;

    @MockitoBean
    QuoteService service;

    @Test
    void getQuotes_returnsList() throws Exception {
        var mockList = List.of(
            new QuoteResponse(10L, 1L, 5, new java.math.BigDecimal("50"), "OK", "REF1", java.time.LocalDateTime.now()),
            new QuoteResponse(20L, 2L, 8, new java.math.BigDecimal("80"), "OK", "REF2", java.time.LocalDateTime.now())
        );
        when(service.listAll()).thenReturn(mockList);

        mvc.perform(get("/api/quotes"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(2))
           .andExpect(jsonPath("$[0].id").value(10))
           .andExpect(jsonPath("$[1].id").value(20));
    }

    @Test
    void postQuote_returnsCreated() throws Exception {
        var req = new CreateQuoteRequest(42L, null, null);
        var resp = new QuoteResponse(100L, 42L, 50, new java.math.BigDecimal("500"), "PENDING", "Q123", java.time.LocalDateTime.now());
        when(service.createQuote(any())).thenReturn(resp);

        mvc.perform(post("/api/quotes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(100))
           .andExpect(jsonPath("$.customerId").value(42))
           .andExpect(jsonPath("$.status").value("PENDING"));
    }
}
