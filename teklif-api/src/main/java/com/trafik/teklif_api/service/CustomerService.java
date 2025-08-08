package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import java.util.List;
import java.util.UUID;

public interface CustomerService {

    // — CRUD —
    List<CustomerResponse> getAllCustomers();
    CustomerResponse getCustomerById(UUID id);
    CustomerResponse createCustomer(CustomerRequest request);
    CustomerResponse updateCustomer(UUID id, CustomerRequest request);
    void deleteCustomer(UUID id);

    // — Müşteri bazlı ek işlemler —
    List<QuoteResponse> getCustomerQuotes(UUID customerId);
    List<PolicyResponse> getCustomerPolicies(UUID customerId);
    CustomerNoteResponse addCustomerNote(UUID customerId, CreateCustomerNoteRequest req);
    List<CustomerSearchResponse> searchCustomers(String q);
}
