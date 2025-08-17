package com.trafik.teklif_api.exception;

import com.trafik.teklif_api.controller.PolicyController;
import com.trafik.teklif_api.repository.*;
import com.trafik.teklif_api.service.PolicyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PolicyController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class GlobalExceptionHandlerTest {

    @Autowired private MockMvc mvc;

    @MockBean private PolicyService service;
    @MockBean private PolicyRepository repo;
    @MockBean private QuoteRepository quoteRepo;
    @MockBean private InsuranceCompanyRepository companyRepo;
    @MockBean private PolicyInstallmentRepository installmentRepo;
    @MockBean private PolicyClaimRepository claimRepo;

    @Test
    void should_return_404_when_service_throws_IllegalArgumentException() throws Exception {
        when(service.getAll(anyInt(), anyInt())).thenThrow(new IllegalArgumentException("yok"));

        mvc.perform(get("/api/policies").param("page","0").param("size","10"))
           .andExpect(status().isNotFound()); // GlobalExceptionHandler 404 döndürüyor
    }
}
