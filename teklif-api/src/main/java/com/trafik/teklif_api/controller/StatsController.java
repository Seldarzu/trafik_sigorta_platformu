package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.stats.ConversionResponse;
import com.trafik.teklif_api.dto.stats.CountResponse;
import com.trafik.teklif_api.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService service;

    @GetMapping("/quotes")
    public CountResponse quotes() {
        return service.quotes();
    }

    @GetMapping("/policies")
    public CountResponse policies() {
        return service.policies();
    }

    @GetMapping("/customers")
    public CountResponse customers() {
        return service.customers();
    }

    @GetMapping("/conversion")
    public ConversionResponse conversion() {
        return service.conversion();
    }
}
