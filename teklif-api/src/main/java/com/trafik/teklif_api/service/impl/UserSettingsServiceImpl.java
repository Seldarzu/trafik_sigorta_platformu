package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.dto.NotificationSettingsDto;
import com.trafik.teklif_api.dto.UpdateNotificationSettingsRequest;
import com.trafik.teklif_api.entity.UserSettings;
import com.trafik.teklif_api.repository.UserRepository;
import com.trafik.teklif_api.repository.UserSettingsRepository;
import com.trafik.teklif_api.service.UserSettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class UserSettingsServiceImpl implements UserSettingsService {

    private final UserSettingsRepository settingsRepo;
    private final UserRepository userRepo;

    public UserSettingsServiceImpl(UserSettingsRepository settingsRepo, UserRepository userRepo) {
        this.settingsRepo = settingsRepo;
        this.userRepo = userRepo;
    }

    @Override
    public NotificationSettingsDto getByUserId(UUID userId) {
        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        UserSettings settings = settingsRepo.findByUserId(userId)
                .orElseGet(() -> settingsRepo.save(buildDefault(userId)));

        return toDto(settings);
    }

    @Override
    public NotificationSettingsDto upsert(UUID userId, UpdateNotificationSettingsRequest req) {
        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        UserSettings settings = settingsRepo.findByUserId(userId)
                .orElseGet(() -> buildDefault(userId));

        // Patch alanları
        if (req.getEmailNotifications() != null) settings.setEmailNotifications(req.getEmailNotifications());
        if (req.getSmsNotifications()   != null) settings.setSmsNotifications(req.getSmsNotifications());
        if (req.getPushNotifications()  != null) settings.setPushNotifications(req.getPushNotifications());
        if (req.getQuoteExpiry()        != null) settings.setQuoteExpiry(req.getQuoteExpiry());
        if (req.getNewCustomer()        != null) settings.setNewCustomer(req.getNewCustomer());
        if (req.getPolicyRenewal()      != null) settings.setPolicyRenewal(req.getPolicyRenewal());
        if (req.getSystemUpdates()      != null) settings.setSystemUpdates(req.getSystemUpdates());
        if (req.getMarketingEmails()    != null) settings.setMarketingEmails(req.getMarketingEmails());
        if (req.getWeeklyReports()      != null) settings.setWeeklyReports(req.getWeeklyReports());
        if (req.getMonthlyReports()     != null) settings.setMonthlyReports(req.getMonthlyReports());

        if (req.getLanguage()       != null) settings.setLanguage(req.getLanguage());
        if (req.getTimezone()       != null) settings.setTimezone(req.getTimezone());
        if (req.getCurrency()       != null) settings.setCurrency(req.getCurrency());
        if (req.getDateFormat()     != null) settings.setDateFormat(req.getDateFormat());
        if (req.getTheme()          != null) settings.setTheme(req.getTheme());
        if (req.getAutoSave()       != null) settings.setAutoSave(req.getAutoSave());
        if (req.getSessionTimeout() != null) settings.setSessionTimeout(req.getSessionTimeout());

        settings.setUpdatedAt(OffsetDateTime.now());
        UserSettings saved = settingsRepo.save(settings);
        return toDto(saved);
    }

    // --- Helpers ---

    private UserSettings buildDefault(UUID userId) {
        UserSettings s = new UserSettings();
        s.setUserId(userId);
        s.setEmailNotifications(true);
        s.setSmsNotifications(true);
        s.setPushNotifications(true);
        s.setQuoteExpiry(true);
        s.setNewCustomer(true);
        s.setPolicyRenewal(true);
        s.setSystemUpdates(true);
        s.setMarketingEmails(false);
        s.setWeeklyReports(true);
        s.setMonthlyReports(true);

        s.setLanguage("tr");
        s.setTimezone("Europe/Istanbul");
        s.setCurrency("TRY");
        s.setDateFormat("DD/MM/YYYY");
        s.setTheme("light");
        s.setAutoSave(true);
        s.setSessionTimeout(30);

        s.setCreatedAt(OffsetDateTime.now());
        s.setUpdatedAt(OffsetDateTime.now());
        return s;
    }

    private NotificationSettingsDto toDto(UserSettings s) {
        NotificationSettingsDto dto = new NotificationSettingsDto();
        dto.setEmailNotifications(s.getEmailNotifications());
        dto.setSmsNotifications(s.getSmsNotifications());
        dto.setPushNotifications(s.getPushNotifications());
        dto.setQuoteExpiry(s.getQuoteExpiry());
        dto.setNewCustomer(s.getNewCustomer());
        dto.setPolicyRenewal(s.getPolicyRenewal());
        dto.setSystemUpdates(s.getSystemUpdates());
        dto.setMarketingEmails(s.getMarketingEmails());
        dto.setWeeklyReports(s.getWeeklyReports());
        dto.setMonthlyReports(s.getMonthlyReports());
        dto.setLanguage(s.getLanguage());
        dto.setTimezone(s.getTimezone());
        dto.setCurrency(s.getCurrency());
        dto.setDateFormat(s.getDateFormat());
        dto.setTheme(s.getTheme());
        dto.setAutoSave(s.getAutoSave());
        dto.setSessionTimeout(s.getSessionTimeout());
        return dto;
    }
}
