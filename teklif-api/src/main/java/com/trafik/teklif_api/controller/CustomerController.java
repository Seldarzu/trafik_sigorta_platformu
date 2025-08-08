package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /** Tüm müşterileri listeler */
    @GetMapping
    public List<CustomerResponse> getAll() {
        return customerService.getAllCustomers();
    }

    /** ID’ye göre müşteri getirir */
    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable UUID id) {
        return customerService.getCustomerById(id);
    }

    /** Yeni müşteri oluşturur */
    @PostMapping
    public CustomerResponse create(@Valid @RequestBody CustomerRequest r) {
        return customerService.createCustomer(r);
    }

    /** Mevcut müşteriyi günceller */
    @PutMapping("/{id}")
    public CustomerResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody CustomerRequest r
    ) {
        return customerService.updateCustomer(id, r);
    }

    /** ID’ye göre müşteriyi siler */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        customerService.deleteCustomer(id);
    }

    /** Bir müşterinin tüm tekliflerini döner */
    @GetMapping("/{id}/quotes")
    public List<QuoteResponse> getQuotes(@PathVariable UUID id) {
        return customerService.getCustomerQuotes(id);
    }

    /** Bir müşterinin tüm poliçelerini döner */
    @GetMapping("/{id}/policies")
    public List<PolicyResponse> getPolicies(@PathVariable UUID id) {
        return customerService.getCustomerPolicies(id);
    }

    /** Bir müşteriye not ekler */
    @PostMapping("/{id}/notes")
    public CustomerNoteResponse addNote(
        @PathVariable UUID id,
        @Valid @RequestBody CreateCustomerNoteRequest req
    ) {
        return customerService.addCustomerNote(id, req);
    }

    /** Müşteri araması yapar */
    @GetMapping("/search")
    public List<CustomerSearchResponse> search(@RequestParam("q") String query) {
        return customerService.searchCustomers(query);
    }
}
