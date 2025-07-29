package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.NotificationResponse;
import com.trafik.teklif_api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    public List<NotificationResponse> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}
