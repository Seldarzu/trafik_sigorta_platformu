package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.model.Customer;
import com.trafik.teklif_api.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {
  private final CustomerRepository repo;
  public CustomerService(CustomerRepository repo) { this.repo = repo; }

  public CustomerResponse create(CreateCustomerRequest req) {
    var c = new Customer();
    c.setTcNo(req.tcNo());
    c.setName(req.name());
    c.setBirthDate(req.birthDate());
    c.setPhone(req.phone());
    var saved = repo.save(c);
    return new CustomerResponse(
      saved.getId(),
      saved.getTcNo(),
      saved.getName(),
      saved.getBirthDate(),
      saved.getPhone()
    );
  }

  public List<CustomerResponse> listAll() {
    return repo.findAll().stream()
      .map(c -> new CustomerResponse(
        c.getId(),
        c.getTcNo(),
        c.getName(),
        c.getBirthDate(),
        c.getPhone()
      ))
      .collect(Collectors.toList());
  }
}
