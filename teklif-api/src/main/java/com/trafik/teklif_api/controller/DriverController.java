package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
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

    /** Yeni sürücü oluşturur. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DriverResponse create(@Valid @RequestBody CreateDriverRequest req) {
        return service.create(req);
    }

    /** TC Kimlik Doğrulama */
    @PostMapping("/validate-tc")
    public TcValidationResponse validateTc(@RequestBody TcValidationRequest req) {
        return service.validateTc(req.tcNumber());
    }

    /** Ehliyet Bilgisi Sorgulama */
    @GetMapping("/license-info")
    public LicenseInfoResponse licenseInfo(@RequestParam String tc) {
        return service.licenseInfo(tc);
    }
}
