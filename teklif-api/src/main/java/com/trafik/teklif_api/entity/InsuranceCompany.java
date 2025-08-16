// src/main/java/com/trafik/teklif_api/entity/InsuranceCompany.java
package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "insurance_companies",
       uniqueConstraints = @UniqueConstraint(name="uk_ins_company_code", columnNames = {"code"}))
@Getter @Setter
public class InsuranceCompany extends BaseEntity {

  @Column(nullable = false, length = 160)
  private String name;

  /** FE bekliyor: unik kısa kod (örn: ECO, DNG, PRM) */
  @Column(nullable = false, length = 32)
  private String code;

  @Column(name = "logo_url")
  private String logoUrl;

  @Column
  private double rating = 0.0;

  @Column(name = "total_reviews", nullable = false)
  private int totalReviews = 0;

  @Column(name = "contact_email")
  private String contactEmail;

  @Column(name = "contact_phone")
  private String contactPhone;

  @Column(name = "website_url")
  private String websiteUrl;

  @Column(name = "is_active", nullable = false)
  private boolean isActive = true;
}
