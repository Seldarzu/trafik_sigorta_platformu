// src/main/java/com/trafik/teklif_api/service/impl/SystemSettingsServiceImpl.java
package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.SystemSettingsRequest;
import com.trafik.teklif_api.dto.SystemSettingsResponse;
import com.trafik.teklif_api.entity.SystemSettingKV;
import com.trafik.teklif_api.repository.SystemSettingKVRepository;
import com.trafik.teklif_api.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
        return new SystemSettingsResponse(
            getString("agency_name"),
            getString("agency_code"),
            getString("license_number"),
            getLocalDate("join_date"),
            getLocalDate("last_login"),
            getBoolean("is_active")
        );
    }

    // ——— PUT (upsert) ———
    @Override
    @Transactional
    public void update(SystemSettingsRequest req) {
        upsert("agency_name",   req.agencyName(),   "string");
        upsert("agency_code",   req.agencyCode(),   "string");
        upsert("license_number",req.licenseNumber(),"string");
        upsert("join_date",     req.joinDate()!=null ? req.joinDate().toString() : null, "string");
        upsert("last_login",    req.lastLogin()!=null? req.lastLogin().toString(): null, "string");
        upsert("is_active",     req.isActive()!=null ? req.isActive().toString() : null, "boolean");
    }

    // ——— Yardımcılar ———
    private String getString(String key) { return kvRepo.findByKey(key).map(SystemSettingKV::getValue).orElse(null); }
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
