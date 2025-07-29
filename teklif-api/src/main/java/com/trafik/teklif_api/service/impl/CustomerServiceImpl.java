// src/main/java/com/trafik/teklif_api/service/impl/CustomerServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.CustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.entity.Customer;
import com.trafik.teklif_api.repository.CustomerRepository;
import com.trafik.teklif_api.service.CustomerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository repo) {
        this.customerRepository = repo;
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        return customerRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + id));
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest r) {
        Customer c = new Customer();
        c.setTcNumber(r.getTcNumber());
        c.setFirstName(r.getFirstName());
        c.setLastName(r.getLastName());
        c.setBirthDate(r.getBirthDate());
        c.setPhone(r.getPhone());
        c.setEmail(r.getEmail());
        c.setAddress(r.getAddress());
        c.setCity(r.getCity());
        c.setStatus(r.getStatus());
        c.setNotes(r.getNotes());
        // riskProfile & customerValue DB default kullanılsın (entity'de insertable=false)
        Customer saved = customerRepository.save(c);
        return toResponse(saved);
    }

    @Override
    public CustomerResponse updateCustomer(Long id, CustomerRequest r) {
        Customer c = customerRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + id));
        c.setTcNumber(r.getTcNumber());
        c.setFirstName(r.getFirstName());
        c.setLastName(r.getLastName());
        c.setBirthDate(r.getBirthDate());
        c.setPhone(r.getPhone());
        c.setEmail(r.getEmail());
        c.setAddress(r.getAddress());
        c.setCity(r.getCity());
        c.setStatus(r.getStatus());
        c.setNotes(r.getNotes());
        Customer updated = customerRepository.save(c);
        return toResponse(updated);
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new EntityNotFoundException("Customer not found: " + id);
        }
        customerRepository.deleteById(id);
    }

    private CustomerResponse toResponse(Customer c) {
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
