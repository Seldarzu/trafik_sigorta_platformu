package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.SystemSettingsRequest;
import com.trafik.teklif_api.dto.SystemSettingsResponse;
import com.trafik.teklif_api.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public void update(@RequestBody SystemSettingsRequest req) {
        service.update(req);
    }
}
