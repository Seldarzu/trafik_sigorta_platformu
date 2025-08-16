package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    // TC'den upsert için
    Optional<Driver> findByTcNumber(String tcNumber);

    // Bir quote id'sinden sürücüye gitmek gerekiyorsa
    Optional<Driver> findByQuotes_Id(String id);


}
