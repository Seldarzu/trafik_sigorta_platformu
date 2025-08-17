package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.CustomerCommunication;
import com.trafik.teklif_api.entity.LoyaltyTransaction;
import com.trafik.teklif_api.repository.CustomerCommunicationRepository;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.LoyaltyTransactionRepository;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // Repos sadece iletişim/loyalty ek uçları için kullanılıyor
    private final CustomerRepository customerRepo;
    private final CustomerCommunicationRepository commRepo;
    private final LoyaltyTransactionRepository loyaltyRepo;

    // -------- Core DTO tabanlı uçlar --------

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
    public CustomerResponse update(@PathVariable UUID id,
                                   @Valid @RequestBody CustomerRequest r) {
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

    /** Müşteri araması yapar */
    @GetMapping("/search")
    public List<CustomerSearchResponse> search(@RequestParam("q") String query) {
        return customerService.searchCustomers(query);
    }

    /** Müşteriye not ekler */
    @PostMapping("/{id}/notes")
    public CustomerNoteResponse addNote(@PathVariable UUID id,
                                        @Valid @RequestBody CreateCustomerNoteRequest req) {
        return customerService.addCustomerNote(id, req);
    }

    // -------- Ek işlevler (iletişim ve sadakat) --------

    /** Müşterinin tüm iletişim kayıtları */
    @GetMapping("/{id}/communications")
    public List<CustomerCommunication> communications(@PathVariable UUID id) {
        return commRepo.findAll().stream()
                .filter(c -> c.getCustomer() != null && id.equals(c.getCustomer().getId()))
                .collect(Collectors.toList());
    }

    /** Müşteriyle iletişim kaydı oluşturur */
    @PostMapping("/{id}/communicate")
    public CustomerCommunication communicate(@PathVariable UUID id,
                                             @Valid @RequestBody CustomerCommunication c) {
        Customer customer = customerRepo.findById(id).orElseThrow();
        c.setCustomer(customer);
        return commRepo.save(c);
    }

    /** Müşterinin toplam sadakat puanı */
    @GetMapping("/{id}/loyalty")
    public Map<String, Object> loyalty(@PathVariable UUID id) {
        int points = loyaltyRepo.findAll().stream()
                .filter(l -> l.getCustomer() != null && id.equals(l.getCustomer().getId()))
                .mapToInt(LoyaltyTransaction::getPoints) // <-- null kıyasını kaldırdık
                .sum();
        return Map.of("customerId", id.toString(), "points", points);
    }

    /** Puan harcama işlemi (redeem) */
    @PostMapping("/{id}/loyalty/redeem")
    public Map<String, Object> redeem(@PathVariable UUID id,
                                      @RequestParam int points) {
        LoyaltyTransaction lt = new LoyaltyTransaction();
        lt.setCustomer(customerRepo.findById(id).orElseThrow());
        lt.setTransactionType("redeem");
        lt.setPoints(-Math.abs(points));
        lt.setReason("Manual redeem");
        loyaltyRepo.save(lt);
        return loyalty(id);
    }
}
