package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.CreateVehicleRequest;
import com.trafik.teklif_api.dto.UpdateVehicleRequest;
import com.trafik.teklif_api.dto.VehicleBrandResponse;
import com.trafik.teklif_api.dto.VehicleModelResponse;
import com.trafik.teklif_api.dto.VehicleResponse;
import com.trafik.teklif_api.dto.PlateValidationResponse;
import com.trafik.teklif_api.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;

    /** Yeni araç ekler (DTO). */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse create(@Valid @RequestBody CreateVehicleRequest req) {
        return service.create(req);
    }

    /** Tüm araçları listeler (DTO). */
    @GetMapping
    public List<VehicleResponse> getAll() {
        return service.getAll();
    }

    /** ID’ye göre araç getirir (DTO). */
    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    /** Aracı günceller (DTO). */
    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateVehicleRequest req) {
        return service.update(id, req);
    }

    /** ID’ye göre aracı siler. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    /** Tüm aktif marka listesi. */
    @GetMapping("/brands")
    public List<VehicleBrandResponse> brands() {
        return service.getBrands();
    }

    /** Bir markaya ait aktif modeller. */
    @GetMapping("/models/{brand}")
    public List<VehicleModelResponse> models(@PathVariable String brand) {
        return service.getModelsByBrand(brand);
    }

    /** Plaka doğrulama. */
    @GetMapping("/validate-plate")
    public PlateValidationResponse validatePlate(@RequestParam String plate) {
        return service.validatePlate(plate);
    }
}
