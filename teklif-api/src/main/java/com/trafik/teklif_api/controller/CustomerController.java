package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;
    public CustomerController(CustomerService service) {
        this.customerService = service;
    }

    @GetMapping
    public List<CustomerResponse> getAll() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    @PostMapping
    public CustomerResponse create(@Valid @RequestBody CustomerRequest r) {
        return customerService.createCustomer(r);
    }

    @PutMapping("/{id}")
    public CustomerResponse update(
        @PathVariable Long id,
        @Valid @RequestBody CustomerRequest r
    ) {
        return customerService.updateCustomer(id, r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }
}
