// src/main/java/com/trafik/teklif_api/repository/VehicleRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * Verilen teklif ID’sine ait aracı getirir.
     */
    Optional<Vehicle> findByQuoteId(Long quoteId);
}
