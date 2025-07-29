package com.trafik.teklif_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trafik.teklif_api.entity.Driver;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
}
