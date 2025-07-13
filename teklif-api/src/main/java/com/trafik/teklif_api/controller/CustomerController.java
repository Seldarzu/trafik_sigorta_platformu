package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.CreateCustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CreateCustomerRequest req) {
        CustomerResponse resp = customerService.create(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resp);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> listCustomers() {
        List<CustomerResponse> list = customerService.listAll();
        return ResponseEntity.ok(list);
    }
}
