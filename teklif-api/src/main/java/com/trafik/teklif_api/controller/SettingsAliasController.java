package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.NotificationSettingsService;
import com.trafik.teklif_api.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

/**
 * Spec ile uyum için alias uçları:
 *  - GET/PUT /api/settings/system           -> SystemSettingsService
 *  - GET/PUT /api/settings/notifications    -> NotificationSettingsService (userId zorunlu veya default)
 *  - GET/PUT /api/settings/profile          -> Şimdilik 204 (profil uçları /api/users/{id} altında)
 */
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsAliasController {

    private final SystemSettingsService systemService;
    private final NotificationSettingsService notifSettingsService;

    // ---- SYSTEM ----
    @GetMapping("/system")
    public SystemSettingsResponse getSystem() {
        return systemService.get();
    }

    @PutMapping("/system")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateSystem(@Valid @RequestBody SystemSettingsRequest req) {
        systemService.update(req);
    }

    // ---- NOTIFICATIONS (userId: query ile) ----
    @GetMapping("/notifications")
    public NotificationSettingsResponse getNotifications(
            @RequestParam(name = "userId", required = false) UUID userId
    ) {
        UUID uid = userId != null ? userId : defaultUser();
        return notifSettingsService.get(uid);
    }

    @PutMapping("/notifications")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateNotifications(
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody NotificationSettingsRequest req
    ) {
        UUID uid = userId != null ? userId : defaultUser();
        notifSettingsService.update(uid, req);
    }

    // ---- PROFILE (alias) ----
    // Profil uçları sizde /api/users/{id} altında. Alias şimdilik 204 döndürüyor.
    @GetMapping("/profile")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void getProfileAlias() { /* alias - UI geriye dönük istek atıyorsa 204 */ }

    @PutMapping("/profile")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProfileAlias() { /* alias */ }

    // Uygun bir default kullanıcı stratejisi yoksa, burada basitçe "sanal" bir UUID döndürmek yerine 400 de atılabilir.
    // Demo amaçlı pseudo bir UUID üretelim (UI tarafı genelde userId geçecek).
    private UUID defaultUser() {
        // NOT: gerçek sistemde SecurityContext/Session’dan okunmalı.
        return UUID.nameUUIDFromBytes("default-user".getBytes());
    }
}
