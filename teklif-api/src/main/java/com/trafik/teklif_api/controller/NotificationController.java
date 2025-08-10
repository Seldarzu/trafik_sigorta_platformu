// src/main/java/com/trafik/teklif_api/controller/NotificationController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.NotificationResponse;
import com.trafik.teklif_api.dto.notification.MarkReadRequest;
import com.trafik.teklif_api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public List<NotificationResponse> getAll() {
        return service.getAll();
    }

    // Eski yol: PUT /api/notifications/{id}/read
    @PutMapping("/{id}/read")
    public void markReadByPath(@PathVariable UUID id) {
        service.markAsRead(id);
    }

    // Yeni yol: POST /api/notifications/mark-read  (body: {"id":"uuid"})
    @PostMapping("/mark-read")
    public void markRead(@RequestBody MarkReadRequest req) {
        service.markAsRead(req.id());
    }
}
