// src/main/java/com/trafik/teklif_api/service/impl/NotificationServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.NotificationResponse;
import com.trafik.teklif_api.entity.Notification;
import com.trafik.teklif_api.repository.NotificationRepository;
import com.trafik.teklif_api.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repo;

    @Override
    public List<NotificationResponse> getAll() {
        return repo.findAll().stream()
            .map(n -> new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getIsRead(),
                n.getCreatedAt(),
                n.getActionUrl(),
                n.getActionText()
            ))
            .toList();
    }

    @Override
    public void markAsRead(UUID id) {
        Notification n = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Notification " + id + " bulunamadı"));
        n.setIsRead(true);
        repo.save(n);
    }
}
