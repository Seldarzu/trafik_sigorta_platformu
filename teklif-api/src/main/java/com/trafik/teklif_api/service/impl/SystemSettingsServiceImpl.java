package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.repository.SystemSettingsRepository;
import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.SystemSettings;
import com.trafik.teklif_api.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemSettingsServiceImpl implements SystemSettingsService {
    private final SystemSettingsRepository repo;

    @Override
    public SystemSettingsResponse get() {
        SystemSettings s = repo.findById(1L).orElseThrow();
        return new SystemSettingsResponse(
            s.getAgencyName(), s.getAgencyCode(), s.getLicenseNumber(),
            s.getJoinDate(), s.getLastLogin(), s.getIsActive()
        );
    }

    @Override
    public void update(SystemSettingsRequest req) {
        SystemSettings s = new SystemSettings(
            1L, req.agencyName(), req.agencyCode(), req.licenseNumber(),
            req.joinDate(), req.lastLogin(), req.isActive()
        );
        repo.save(s);
    }
}
