// src/main/java/com/trafik/teklif_api/entity/CoverageTemplate.java
package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coverage_templates")
@Getter @Setter
public class CoverageTemplate extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "company_id")
  private InsuranceCompany company;

  @Column(nullable = false, length = 120)
  private String name;

  /** Özet rakamlar (örnek) – istersen detay JSON da tutabilirsin */
  @Column(name = "person_damage_amount")
  private Double personDamageAmount;

  @Column(name = "material_damage_amount")
  private Double materialDamageAmount;

  @Column(name = "legal_protection_amount")
  private Double legalProtectionAmount;

  @Column(name = "is_active", nullable = false)
  private boolean isActive = true;
}
