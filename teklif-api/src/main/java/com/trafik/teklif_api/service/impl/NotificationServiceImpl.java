package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.repository.NotificationRepository;
import com.trafik.teklif_api.dto.NotificationResponse;
import com.trafik.teklif_api.entity.Notification;
import com.trafik.teklif_api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository repo;

    @Override
    public List<NotificationResponse> getAll() {
        return repo.findAll().stream()
            .map(n -> new NotificationResponse(
                n.getId(), n.getType(), n.getMessage(),
                n.getIsRead(), n.getDate()
            )).collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long id) {
        Notification n = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Notification "+id+" bulunamadı"));
        n.setIsRead(true);
        repo.save(n);
    }
}
