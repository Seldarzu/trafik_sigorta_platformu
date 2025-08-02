// src/main/java/com/trafik/teklif_api/controller/VehicleController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.CreateVehicleRequest;
import com.trafik.teklif_api.dto.UpdateVehicleRequest;
import com.trafik.teklif_api.dto.VehicleResponse;
import com.trafik.teklif_api.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;

    /**
     * Yeni araç ekler.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse create(@Valid @RequestBody CreateVehicleRequest req) {
        return service.create(req);
    }

    /**
     * Tüm araçları listeler.
     */
    @GetMapping
    public List<VehicleResponse> getAll() {
        return service.getAll();
    }

    /**
     * ID’ye göre araç getirir.
     */
    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    /**
     * Mevcut aracı günceller.
     */
    @PutMapping("/{id}")
    public VehicleResponse update(
        @PathVariable Long id,
        @Valid @RequestBody UpdateVehicleRequest req
    ) {
        return service.update(id, req);
    }

    /**
     * ID’ye göre aracı siler.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
