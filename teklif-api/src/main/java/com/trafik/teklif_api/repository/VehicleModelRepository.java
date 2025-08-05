package com.trafik.teklif_api.repository;
import com.trafik.teklif_api.entity.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface VehicleModelRepository extends JpaRepository<VehicleModel, UUID> {
    List<VehicleModel> findByBrandIdAndIsActiveTrueOrderByNameAsc(UUID brandId);
}
