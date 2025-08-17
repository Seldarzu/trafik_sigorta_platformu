package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.system.HealthResponse;
import com.trafik.teklif_api.dto.system.SystemConfigResponse;
import com.trafik.teklif_api.dto.system.VersionResponse;
import com.trafik.teklif_api.repository.SystemSettingKVRepository;
import com.trafik.teklif_api.service.SystemInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service @RequiredArgsConstructor
public class SystemInfoServiceImpl implements SystemInfoService {

    private final SystemSettingKVRepository kvRepo;

    @Value("${app.version:dev}")
    private String appVersion;

    @Override
    public HealthResponse health() {
        boolean dbUp = true;
        try { kvRepo.count(); } catch (Exception e) { dbUp = false; }
        return new HealthResponse("UP", dbUp ? "UP" : "DOWN");
    }

    @Override
    public VersionResponse version() { return new VersionResponse(appVersion); }

    @Override
    public SystemConfigResponse config() {
        return new SystemConfigResponse(
            val("agency_name"),
            val("agency_code"),
            val("license_number"),
            parseDate(val("join_date")),
            parseDate(val("last_login")),
            parseBool(val("is_active"))
        );
    }

    private String val(String key){ return kvRepo.findByKey(key).map(x->x.getValue()).orElse(null); }
    private static LocalDate parseDate(String s){ return (s==null||s.isBlank())?null:LocalDate.parse(s); }
    private static Boolean parseBool(String s){ return (s==null)?null:Boolean.valueOf(s); }
}
