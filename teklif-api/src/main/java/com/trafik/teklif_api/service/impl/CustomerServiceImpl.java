// src/main/java/com/trafik/teklif_api/service/impl/CustomerServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.entity.CustomerNote;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.repository.QuoteRepository;
import com.trafik.teklif_api.repository.PolicyRepository;
import com.trafik.teklif_api.repository.CustomerNoteRepository;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepo;
    private final QuoteRepository quoteRepo;
    private final PolicyRepository policyRepo;
    private final CustomerNoteRepository noteRepo;

    public CustomerServiceImpl(CustomerRepository customerRepo,
                               QuoteRepository quoteRepo,
                               PolicyRepository policyRepo,
                               CustomerNoteRepository noteRepo) {
        this.customerRepo = customerRepo;
        this.quoteRepo    = quoteRepo;
        this.policyRepo   = policyRepo;
        this.noteRepo     = noteRepo;
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepo.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getCustomerById(UUID id) {
        Customer c = customerRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + id));
        return mapToResponse(c);
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest req) {
        Customer c = new Customer();
        c.setTcNumber(req.tcNumber());
        c.setFirstName(req.firstName());
        c.setLastName(req.lastName());
        c.setBirthDate(req.birthDate());
        c.setPhone(req.phone());
        c.setEmail(req.email());
        c.setAddress(req.address());
        c.setCity(req.city());
        c.setStatus(req.status());
        c.setRiskProfile(req.riskProfile());
        c.setCustomerValue(req.customerValue());
        c.setNotes(req.notes());
        Customer saved = customerRepo.save(c);
        return mapToResponse(saved);
    }

    @Override
    public CustomerResponse updateCustomer(UUID id, CustomerRequest req) {
        return customerRepo.findById(id)
            .map(c -> {
                c.setTcNumber(req.tcNumber());
                c.setFirstName(req.firstName());
                c.setLastName(req.lastName());
                c.setBirthDate(req.birthDate());
                c.setPhone(req.phone());
                c.setEmail(req.email());
                c.setAddress(req.address());
                c.setCity(req.city());
                c.setStatus(req.status());
                c.setRiskProfile(req.riskProfile());
                c.setCustomerValue(req.customerValue());
                c.setNotes(req.notes());
                Customer updated = customerRepo.save(c);
                return mapToResponse(updated);
            })
            .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + id));
    }

    @Override
    public void deleteCustomer(UUID id) {
        customerRepo.deleteById(id);
    }
  @Override
    public List<QuoteResponse> getCustomerQuotes(UUID customerId) {
        return quoteRepo.findByCustomerIdOrderByCreatedAtDesc(customerId)
            .stream()
            .map(q -> new QuoteResponse(
                q.getId(),
                q.getCustomerId(),
                q.getRiskScore(),
                q.getPremium(),
                q.getCoverageAmount(),   // doğru getter
                q.getFinalPremium(),     // doğru getter
                q.getTotalDiscount(),    // doğru getter
                q.getRiskLevel(),        // doğru getter
                q.getStatus(),
                q.getValidUntil(),
                q.getCreatedAt()         // doğru getter
            ))
            .collect(Collectors.toList());
    }
    
      

    @Override
    public List<PolicyResponse> getCustomerPolicies(UUID customerId) {
        return policyRepo.findByCustomerIdOrderByEndDateDesc(customerId)
            .stream()
            .map(p -> new PolicyResponse(
                p.getId(),
                p.getQuoteId(),
                p.getCustomerId(),
                p.getPolicyNumber(),
                p.getFinalPremium(),
                p.getStartDate(),
                p.getEndDate(),
                p.getStatus(),
                p.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Override
    public CustomerNoteResponse addCustomerNote(UUID customerId, CreateCustomerNoteRequest req) {
        Customer cust = customerRepo.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı: " + customerId));
        CustomerNote note = new CustomerNote();
        note.setCustomer(cust);
        note.setNote(req.note());
        CustomerNote saved = noteRepo.save(note);
        return new CustomerNoteResponse(
            saved.getId(),
            saved.getNote(),
            saved.getCreatedAt()
        );
    }

    @Override
    public List<CustomerSearchResponse> searchCustomers(String q) {
        Specification<Customer> spec = (root, query, cb) -> {
            String pattern = "%" + q.toLowerCase() + "%";
            Predicate byFirst = cb.like(cb.lower(root.get("firstName")), pattern);
            Predicate byLast  = cb.like(cb.lower(root.get("lastName")), pattern);
            Predicate byEmail = cb.like(cb.lower(root.get("email")), pattern);
            return cb.or(byFirst, byLast, byEmail);
        };
        return customerRepo.findAll(spec)
            .stream()
            .map(cu -> new CustomerSearchResponse(
                cu.getId(),
                cu.getFirstName(),
                cu.getLastName(),
                cu.getEmail(),
                cu.getPhone()
            ))
            .collect(Collectors.toList());
    }
  private CustomerResponse mapToResponse(Customer c) {
        return new CustomerResponse(
            c.getId(),
            c.getTcNumber(),
            c.getFirstName(),
            c.getLastName(),
            c.getBirthDate(),
            c.getPhone(),
            c.getEmail(),
            c.getAddress(),
            c.getCity(),
            c.getStatus(),
            c.getNotes(),
            c.getRegistrationDate(),
            c.getRiskProfile(),
            c.getCustomerValue()
        );
    }
}

