package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.system.HealthResponse;
import com.trafik.teklif_api.dto.system.SystemConfigResponse;
import com.trafik.teklif_api.dto.system.VersionResponse;
import com.trafik.teklif_api.service.SystemInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
public class SystemInfoController {

    private final SystemInfoService service;

    @GetMapping("/health")
    public HealthResponse health() {
        return service.health();
    }

    @GetMapping("/version")
    public VersionResponse version() {
        return service.version();
    }

    @GetMapping("/config")
    public SystemConfigResponse config() {
        return service.config();
    }
}
