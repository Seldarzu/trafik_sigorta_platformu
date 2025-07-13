package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
