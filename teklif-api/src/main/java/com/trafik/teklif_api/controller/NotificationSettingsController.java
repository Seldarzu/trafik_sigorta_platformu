package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.NotificationSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/users/{userId}/notification-settings")
@RequiredArgsConstructor
public class NotificationSettingsController {
    private final NotificationSettingsService service;

    @GetMapping
    public NotificationSettingsResponse get(@PathVariable Long userId) {
        return service.get(userId);
    }

    @PutMapping
    public void update(
      @PathVariable Long userId,
      @Valid @RequestBody NotificationSettingsRequest req
    ) {
        service.update(userId, req);
    }
}
