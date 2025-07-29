package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/system/settings")
@RequiredArgsConstructor
public class SystemSettingsController {
    private final SystemSettingsService service;

    @GetMapping
    public SystemSettingsResponse get() {
        return service.get();
    }

    @PutMapping
    public void update(@Valid @RequestBody SystemSettingsRequest req) {
        service.update(req);
    }
}
