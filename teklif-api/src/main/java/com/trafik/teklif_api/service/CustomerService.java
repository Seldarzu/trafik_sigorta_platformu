package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.CreateCustomerRequest;
import com.trafik.teklif_api.dto.CustomerResponse;
import com.trafik.teklif_api.model.Customer;
import com.trafik.teklif_api.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest req) {
        // DTO'dan entity'ye dönüştür
        Customer entity = new Customer();
        entity.setTcNo(req.getTcNo());
        entity.setName(req.getName());
        entity.setBirthDate(req.getBirthDate());
        entity.setPhone(req.getPhone());

        // Veritabanına kaydet
        Customer saved = customerRepository.save(entity);

        // Kaydedilen entity'yi DTO'ya map et
        CustomerResponse dto = new CustomerResponse();
        dto.setId(saved.getId());
        dto.setTcNo(saved.getTcNo());
        dto.setName(saved.getName());
        dto.setPhone(saved.getPhone());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> listAll() {
        return customerRepository.findAll().stream()
            .map(saved -> {
                CustomerResponse dto = new CustomerResponse();
                dto.setId(saved.getId());
                dto.setTcNo(saved.getTcNo());
                dto.setName(saved.getName());
                dto.setPhone(saved.getPhone());
                return dto;
            })
            .collect(Collectors.toList());
    }
}
