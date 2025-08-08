package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    // Plaka UNIQUE => upsert için lazım
    Optional<Vehicle> findByPlateNumber(String plateNumber);

    // (Varsa kullanıyorsunuz diye bırakıyorum)
    Optional<Vehicle> findByQuote_Id(String quoteId);
}
