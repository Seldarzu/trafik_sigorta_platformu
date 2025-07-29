package com.trafik.teklif_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trafik.teklif_api.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
