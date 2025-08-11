// src/main/java/com/trafik/teklif_api/repository/NotificationSettingsRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.NotificationSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, UUID> {
    Optional<NotificationSettings> findByUserId(UUID userId);
}
