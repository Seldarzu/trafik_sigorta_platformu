// src/main/java/com/trafik/teklif_api/service/NotificationService.java
package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.NotificationResponse;
import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponse> getAll();
    void markAsRead(UUID id);
}
