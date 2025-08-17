package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import java.util.UUID;

public interface NotificationSettingsService {
    NotificationSettingsResponse get(UUID userId);
    void update(UUID userId, NotificationSettingsRequest req);
}
