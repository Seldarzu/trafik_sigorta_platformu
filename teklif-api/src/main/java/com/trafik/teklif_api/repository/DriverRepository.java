package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    Optional<Driver> findByTcNumber(String tcNumber);
}
