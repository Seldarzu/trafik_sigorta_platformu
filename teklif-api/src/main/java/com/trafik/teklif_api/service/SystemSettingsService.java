package com.trafik.teklif_api.service;


import com.trafik.teklif_api.dto.settings.SystemSettingsRequest;
import com.trafik.teklif_api.dto.settings.SystemSettingsResponse;

public interface SystemSettingsService {
    SystemSettingsResponse get();
    void update(SystemSettingsRequest req);
}
