package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    // plakadan upsert için
    Optional<Vehicle> findByPlateNumber(String plateNumber);

    // Bir quote id'sinden araca gitmek gerekiyorsa (collection adı: quotes)
    Optional<Vehicle> findByQuotes_Id(String quoteId);
}
