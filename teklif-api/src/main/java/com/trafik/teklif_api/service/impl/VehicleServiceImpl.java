// src/main/java/com/trafik/teklif_api/service/impl/VehicleServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.repository.VehicleRepository;
import com.trafik.teklif_api.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepo;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepo) {
        this.vehicleRepo = vehicleRepo;
    }

    @Override
    public VehicleResponse create(CreateVehicleRequest req) {
        Vehicle v = new Vehicle();
        v.setPlateNumber(req.plateNumber());
        v.setBrand(req.brand());
        v.setModel(req.model());
        v.setYear(req.year());
        v.setEngineSize(req.engineSize());
        v.setFuelType(req.fuelType());
        v.setUsage(req.usage());
        v.setCityCode(req.cityCode());
        Vehicle saved = vehicleRepo.save(v);
        return map(saved);
    }

    @Override
    public List<VehicleResponse> getAll() {
        return vehicleRepo.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleResponse getById(Long id) {
        Vehicle v = vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle bulunamadı: " + id));
        return map(v);
    }

    @Override
    public VehicleResponse update(Long id, UpdateVehicleRequest req) {
        Vehicle v = vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle bulunamadı: " + id));
        v.setPlateNumber(req.plateNumber());
        v.setBrand(req.brand());
        v.setModel(req.model());
        v.setYear(req.year());
        v.setEngineSize(req.engineSize());
        v.setFuelType(req.fuelType());
        v.setUsage(req.usage());
        v.setCityCode(req.cityCode());
        Vehicle updated = vehicleRepo.save(v);
        return map(updated);
    }

    @Override
    public void delete(Long id) {
        vehicleRepo.deleteById(id);
    }

    private VehicleResponse map(Vehicle v) {
        return new VehicleResponse(
            v.getId(),
            v.getPlateNumber(),
            v.getBrand(),
            v.getModel(),
            v.getYear(),
            v.getEngineSize(),
            v.getFuelType(),
            v.getUsage(),
            v.getCityCode()
        );
    }
}
