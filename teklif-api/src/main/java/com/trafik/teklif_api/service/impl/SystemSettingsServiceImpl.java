// src/main/java/com/trafik/teklif_api/service/impl/SystemSettingsServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.settings.SystemSettingsRequest;
import com.trafik.teklif_api.dto.settings.SystemSettingsResponse;
import com.trafik.teklif_api.entity.SystemSettingKV;
import com.trafik.teklif_api.repository.SystemSettingKVRepository;
import com.trafik.teklif_api.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SystemSettingsServiceImpl implements SystemSettingsService {

    private final SystemSettingKVRepository kvRepo;

    // ——— GET ———
    @Override
    @Transactional(readOnly = true)
    public SystemSettingsResponse get() {
        String    agencyName    = getString("agency_name");
        String    agencyCode    = getString("agency_code");
        String    licenseNumber = getString("license_number");
        LocalDate joinDate      = getLocalDate("join_date");
        LocalDate lastLogin     = getLocalDate("last_login");
        Boolean   isActive      = getBoolean("is_active");

        Map<String, Object> values = new LinkedHashMap<>();
        values.put("agency_name", agencyName);
        values.put("agency_code", agencyCode);
        values.put("license_number", licenseNumber);
        values.put("join_date", joinDate);
        values.put("last_login", lastLogin);
        values.put("is_active", isActive);

        return new SystemSettingsResponse(
            values,
            agencyName,
            agencyCode,
            licenseNumber,
            joinDate,
            lastLogin,
            isActive
        );
    }

    // ——— PUT (upsert) ———
    @Override
    @Transactional
    public void update(SystemSettingsRequest req) {
        upsert("agency_name",    req.agencyName(),                                  "string");
        upsert("agency_code",    req.agencyCode(),                                  "string");
        upsert("license_number", req.licenseNumber(),                               "string");
        upsert("join_date",      req.joinDate()  != null ? req.joinDate().toString()  : null, "string");
        upsert("last_login",     req.lastLogin() != null ? req.lastLogin().toString() : null, "string");
        upsert("is_active",      req.isActive()  != null ? req.isActive().toString()  : null, "boolean");
    }

    // ——— Yardımcılar ———
    private String getString(String key) {
        return kvRepo.findByKey(key).map(SystemSettingKV::getValue).orElse(null);
    }

    private LocalDate getLocalDate(String key) {
        String v = getString(key);
        return (v == null || v.isBlank()) ? null : LocalDate.parse(v);
    }

    private Boolean getBoolean(String key) {
        String v = getString(key);
        return (v == null) ? null : Boolean.valueOf(v);
    }

    private void upsert(String key, String value, String type) {
        Optional<SystemSettingKV> opt = kvRepo.findByKey(key);
        if (opt.isPresent()) {
            SystemSettingKV s = opt.get();
            s.setValue(value);
            s.setType(type);
            kvRepo.save(s);
        } else {
            SystemSettingKV s = new SystemSettingKV();
            s.setId(UUID.randomUUID());
            s.setKey(key);
            s.setValue(value);
            s.setType(type);
            kvRepo.save(s);
        }
    }
}
