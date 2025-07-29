package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.repository.NotificationSettingsRepository;
import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.NotificationSettings;
import com.trafik.teklif_api.service.NotificationSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;


@Service
@RequiredArgsConstructor
public class NotificationSettingsServiceImpl implements NotificationSettingsService {
    private final NotificationSettingsRepository repo;

    @Override
    public NotificationSettingsResponse get(Long userId) {
        NotificationSettings s = repo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Settings "+userId+" bulunamadı"));
        return new NotificationSettingsResponse(
            s.getEmailNotifications(), s.getSmsNotifications(), s.getPushNotifications()
        );
    }

    @Override
    public void update(Long userId, NotificationSettingsRequest req) {
        NotificationSettings s = repo.findById(userId)
            .orElse(new NotificationSettings(userId, true, true, true));
        s.setEmailNotifications(req.emailNotifications());
        s.setSmsNotifications(req.smsNotifications());
        s.setPushNotifications(req.pushNotifications());
        repo.save(s);
    }
}
