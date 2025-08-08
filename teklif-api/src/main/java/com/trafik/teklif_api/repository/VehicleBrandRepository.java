// VehicleBrandRepository.java
package com.trafik.teklif_api.repository;
import com.trafik.teklif_api.entity.VehicleBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleBrandRepository extends JpaRepository<VehicleBrand, UUID> {
    List<VehicleBrand> findByIsActiveTrueOrderByNameAsc();
    Optional<VehicleBrand> findByNameIgnoreCase(String name);
}
