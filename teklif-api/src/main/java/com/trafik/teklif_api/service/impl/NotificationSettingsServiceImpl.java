package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.UserSettings;
import com.trafik.teklif_api.repository.UserSettingsRepository;
import com.trafik.teklif_api.service.NotificationSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class NotificationSettingsServiceImpl implements NotificationSettingsService {
    private final UserSettingsRepository repo;

    @Override
    public NotificationSettingsResponse get(UUID userId) {
        UserSettings s = repo.findByUserId(userId).orElseGet(() -> {
            UserSettings ns = new UserSettings();
            ns.setUserId(userId);
            ns.setEmailNotifications(true);
            ns.setSmsNotifications(true);
            ns.setPushNotifications(true);
            return repo.save(ns);
        });
        return new NotificationSettingsResponse(
                s.getEmailNotifications(), s.getSmsNotifications(), s.getPushNotifications());
    }

    @Override
    public void update(UUID userId, NotificationSettingsRequest req) {
        UserSettings s = repo.findByUserId(userId).orElseGet(() -> {
            UserSettings ns = new UserSettings(); ns.setUserId(userId); return ns;
        });
        s.setEmailNotifications(req.emailNotifications());
        s.setSmsNotifications(req.smsNotifications());
        s.setPushNotifications(req.pushNotifications());
        repo.save(s);
    }
}
