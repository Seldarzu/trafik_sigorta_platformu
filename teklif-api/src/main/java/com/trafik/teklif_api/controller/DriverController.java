// src/main/java/com/trafik/teklif_api/controller/DriverController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.CreateDriverRequest;
import com.trafik.teklif_api.dto.DriverResponse;
import com.trafik.teklif_api.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService service;

    /**
     * Yeni sürücü oluşturur.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DriverResponse create(@Valid @RequestBody CreateDriverRequest req) {
        return service.create(req);
    }
}
