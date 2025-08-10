// src/main/java/com/trafik/teklif_api/entity/SystemSettingKV.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "system_settings")
public class SystemSettingKV {

    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;

    @Column(name = "setting_key", nullable = false, unique = true)
    private String key;

    @Column(name = "setting_value")
    private String value;

    @Column(name = "setting_type")
    private String type; // string|number|boolean|json

    @Column(name = "description")
    private String description;

    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
