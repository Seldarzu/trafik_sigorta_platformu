// src/test/java/com/trafik/teklif_api/controller/CustomerControllerTest.java
package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.dto.CreateCustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    CustomerService service;

    @Autowired
    ObjectMapper om;

    @Test
    void postCustomer_returnsCreated() throws Exception {
        // Arrange
        CreateCustomerRequest req = new CreateCustomerRequest();
        req.setTcNo("12345678901");
        req.setName("Test User");

        CustomerResponse mockResp = new CustomerResponse();
        mockResp.setId(1L);
        mockResp.setTcNo(req.getTcNo());
        mockResp.setName(req.getName());
        when(service.create(any())).thenReturn(mockResp);

        // Act & Assert
        mvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(1))
           .andExpect(jsonPath("$.tcNo").value("12345678901"))
           .andExpect(jsonPath("$.name").value("Test User"));
    }
}
