package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import java.util.List;

public interface VehicleService {
    VehicleResponse create(CreateVehicleRequest req);
    List<VehicleResponse> getAll();
    VehicleResponse getById(Long id);
    VehicleResponse update(Long id, UpdateVehicleRequest req);
    void delete(Long id);
}
