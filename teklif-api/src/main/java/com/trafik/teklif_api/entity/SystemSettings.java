package com.trafik.teklif_api.entity;

import lombok.*;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="system_settings")
public class SystemSettings {
    @Id
    private Long id; // sabit: genellikle 1

    private String agencyName;
    private String agencyCode;
    private String licenseNumber;
    private LocalDate joinDate;
    private LocalDate lastLogin;
    private Boolean isActive;
}
