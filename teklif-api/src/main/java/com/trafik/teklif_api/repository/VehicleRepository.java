package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    /**
     * Verilen teklif (quote) ID’sine ait aracı getirir.
     */
    Optional<Vehicle> findByQuote_Id(Long quoteId); 

    
}
