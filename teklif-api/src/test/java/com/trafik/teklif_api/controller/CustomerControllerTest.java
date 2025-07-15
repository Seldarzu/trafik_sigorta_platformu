package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.dto.CreateCustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper om;

    // Spring Boot 3.4+ ile @MockBean yerine @MockitoBean
    @MockitoBean
    CustomerService service;

    @Test
    void postCustomer_returnsCreated() throws Exception {
        var req = new CreateCustomerRequest(
            "12345678901",
            "Test User",
            LocalDate.of(1990,1,1),
            "555-1234"
        );

        var mockResp = new CustomerResponse(
            1L,
            req.tcNo(),
            req.name(),
            req.birthDate(),
            req.phone()
        );
        when(service.create(any())).thenReturn(mockResp);

        mvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(1))
           .andExpect(jsonPath("$.tcNo").value("12345678901"))
           .andExpect(jsonPath("$.name").value("Test User"))
           .andExpect(jsonPath("$.birthDate").value("1990-01-01"))
           .andExpect(jsonPath("$.phone").value("555-1234"));
    }
}
