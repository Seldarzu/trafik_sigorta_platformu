package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.system.HealthResponse;
import com.trafik.teklif_api.dto.system.SystemConfigResponse;
import com.trafik.teklif_api.dto.system.VersionResponse;

public interface SystemInfoService {
    HealthResponse health();
    VersionResponse version();
    SystemConfigResponse config();
}
