// src/main/java/com/trafik/teklif_api/entity/SystemSettingKV.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "system_settings_kv")
public class SystemSettingKV {

    /* ---- KIMLIK ---- */
    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    /* ---- ANAHTAR & DEĞER ---- */
    @Column(name = "setting_key", length = 80, nullable = false, unique = true)
    private String key;

    // jsonb tipinde değer saklanır
    @Column(name = "setting_value", columnDefinition = "jsonb", nullable = false)
    private String value;

    /* ---- EK ALANLAR ---- */
    @Column(name = "setting_type", length = 20)
    private String type; // string|number|boolean|json

    @Column(name = "description")
    private String description;

    @Column(name = "is_public")
    private Boolean isPublic = Boolean.FALSE;

    /* ---- ZAMAN DAMGALARI ---- */
    @Column(name = "created_at", columnDefinition = "timestamptz")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", columnDefinition = "timestamptz")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    /* ---- OTOMATIK GÜNCELLEME ---- */
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
