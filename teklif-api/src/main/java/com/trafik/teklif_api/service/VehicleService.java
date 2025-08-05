package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import java.util.List;
import java.util.UUID;

public interface VehicleService {
    VehicleResponse create(CreateVehicleRequest req);
    List<VehicleResponse> getAll();
    VehicleResponse getById(UUID id);
    VehicleResponse update(UUID id, UpdateVehicleRequest req);
    void delete(UUID id);
    List<VehicleBrandResponse> getBrands();
    List<VehicleModelResponse> getModelsByBrand(String brand);
    PlateValidationResponse validatePlate(String plate);
}

