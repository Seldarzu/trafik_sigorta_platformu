package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.repository.*;
import com.trafik.teklif_api.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepo;
    private final VehicleBrandRepository brandRepo;
    private final VehicleModelRepository modelRepo;

    @Autowired
    public VehicleServiceImpl(
            VehicleRepository vehicleRepo,
            VehicleBrandRepository brandRepo,
            VehicleModelRepository modelRepo
    ) {
        this.vehicleRepo = vehicleRepo;
        this.brandRepo = brandRepo;
        this.modelRepo = modelRepo;
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
                .stream().map(this::map).toList();
    }

    @Override
    public VehicleResponse getById(UUID id) {
        Vehicle v = vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Araç bulunamadı: " + id));
        return map(v);
    }

    @Override
    public VehicleResponse update(UUID id, UpdateVehicleRequest req) {
        Vehicle v = vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Araç bulunamadı: " + id));
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
    public void delete(UUID id) {
        vehicleRepo.deleteById(id);
    }

    @Override
    public List<VehicleBrandResponse> getBrands() {
        return brandRepo.findByIsActiveTrueOrderByNameAsc()
                .stream()
                .map(b -> new VehicleBrandResponse(b.getId(), b.getName()))
                .toList();
    }

    @Override
    public List<VehicleModelResponse> getModelsByBrand(String brand) {
        var brandEntity = brandRepo.findByNameIgnoreCase(brand)
                .orElseThrow(() -> new RuntimeException("Marka bulunamadı: " + brand));
        return modelRepo.findByBrandIdAndIsActiveTrueOrderByNameAsc(brandEntity.getId())
                .stream()
                .map(m -> new VehicleModelResponse(m.getId(), m.getName()))
                .toList();
    }

    @Override
    public PlateValidationResponse validatePlate(String plate) {
        boolean valid = Pattern.matches("^[0-9]{2}[A-Z]{1,3}[0-9]{2,4}$", plate.replaceAll("\\s+","").toUpperCase());
        return new PlateValidationResponse(plate, valid);
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
