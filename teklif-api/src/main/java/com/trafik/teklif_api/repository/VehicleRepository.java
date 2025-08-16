// src/main/java/com/trafik/teklif_api/repository/VehicleRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Vehicle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {

     Optional<Vehicle> findByQuotes_Id(String id);
}
