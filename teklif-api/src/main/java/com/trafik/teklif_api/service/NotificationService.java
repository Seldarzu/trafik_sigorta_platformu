package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.NotificationResponse;
import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getAll();
    void markAsRead(Long id);
}
