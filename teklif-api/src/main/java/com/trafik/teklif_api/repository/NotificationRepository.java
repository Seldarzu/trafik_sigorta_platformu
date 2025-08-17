// src/main/java/com/trafik/teklif_api/repository/NotificationRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> { }
