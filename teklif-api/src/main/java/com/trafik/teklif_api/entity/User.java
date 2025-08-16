// src/main/java/com/trafik/teklif_api/entity/User.java
package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import com.trafik.teklif_api.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 80)
    private String lastName;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false, length = 32)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private UserRole role = UserRole.agent;

    @Column(name = "agency_name", nullable = false, length = 120)
    private String agencyName;

    @Column(name = "agency_code", nullable = false, length = 60)
    private String agencyCode;

    @Column(name = "license_number", nullable = false, length = 60)
    private String licenseNumber;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "last_login")
    private OffsetDateTime lastLogin;
}
