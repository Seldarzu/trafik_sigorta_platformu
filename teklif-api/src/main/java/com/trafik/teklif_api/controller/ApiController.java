package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.model.Customer;
import com.trafik.teklif_api.model.Quote;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final CustomerRepository customerRepo;
    private final QuoteRepository quoteRepo;

    public ApiController(CustomerRepository customerRepo,
                         QuoteRepository quoteRepo) {
        this.customerRepo = customerRepo;
        this.quoteRepo = quoteRepo;
    }

    @PostMapping("/customers")
    public Customer createCustomer(@RequestBody Customer c) {
        return customerRepo.save(c);
    }

    @GetMapping("/customers")
    public List<Customer> listCustomers() {
        return customerRepo.findAll();
    }

    @PostMapping("/quotes")
    public Quote createQuote(@RequestBody QuoteRequest dto) {
        Customer cust = customerRepo.findById(dto.customerId)
                          .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        Quote q = new Quote();
        q.setCustomer(cust);
        q.setRiskScore(50);  // placeholder
        q.setPremiumAmount(BigDecimal.valueOf(750));  // placeholder
        q.setStatus("pending");
        q.setUniqueRefNo("T" + System.currentTimeMillis());
        return quoteRepo.save(q);
    }

    @GetMapping("/quotes")
    public List<Quote> listQuotes() {
        return quoteRepo.findAll();
    }

    public static class QuoteRequest {
        public Long customerId;
    }
}
