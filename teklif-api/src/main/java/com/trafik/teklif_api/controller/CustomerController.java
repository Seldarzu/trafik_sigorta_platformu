package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
  private final CustomerService svc;
  public CustomerController(CustomerService svc) { this.svc = svc; }

  @PostMapping
  public ResponseEntity<CustomerResponse> create(
      @Valid @RequestBody CreateCustomerRequest req) {
    var resp = svc.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(resp);
  }

  @GetMapping
  public List<CustomerResponse> list() {
    return svc.listAll();
  }
}
