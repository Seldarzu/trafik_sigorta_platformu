package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;

public interface SystemSettingsService {
    SystemSettingsResponse get();
    void update(SystemSettingsRequest req);
}
