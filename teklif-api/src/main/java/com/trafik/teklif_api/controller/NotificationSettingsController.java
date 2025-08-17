package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.NotificationSettingsDto;
import com.trafik.teklif_api.dto.UpdateNotificationSettingsRequest;
import com.trafik.teklif_api.service.UserSettingsService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/{userId}/notification-settings")
public class NotificationSettingsController {

    private final UserSettingsService service;

    public NotificationSettingsController(UserSettingsService service) {
        this.service = service;
    }

    @GetMapping
    public NotificationSettingsDto get(@PathVariable UUID userId) {
        return service.getByUserId(userId);
    }

    @PutMapping
    public NotificationSettingsDto update(@PathVariable UUID userId,
                                          @RequestBody UpdateNotificationSettingsRequest req) {
        return service.upsert(userId, req);
    }
}
