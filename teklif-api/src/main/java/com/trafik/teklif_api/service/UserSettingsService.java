package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.NotificationSettingsDto;
import com.trafik.teklif_api.dto.UpdateNotificationSettingsRequest;

import java.util.UUID;

public interface UserSettingsService {
    NotificationSettingsDto getByUserId(UUID userId);
    NotificationSettingsDto upsert(UUID userId, UpdateNotificationSettingsRequest req);
}
