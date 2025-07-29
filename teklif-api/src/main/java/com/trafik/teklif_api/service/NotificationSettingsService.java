package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;

public interface NotificationSettingsService {
    NotificationSettingsResponse get(Long userId);
    void update(Long userId, NotificationSettingsRequest req);
}
