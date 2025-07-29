package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService service;

    @PostMapping
    public VehicleResponse create(@Valid @RequestBody CreateVehicleRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<VehicleResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public VehicleResponse update(
        @PathVariable Long id,
        @Valid @RequestBody UpdateVehicleRequest req
    ) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
