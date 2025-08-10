// src/main/java/com/trafik/teklif_api/repository/SystemSettingKVRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.SystemSettingKV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SystemSettingKVRepository extends JpaRepository<SystemSettingKV, UUID> {
    Optional<SystemSettingKV> findByKey(String key);
}
