package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import com.trafik.teklif_api.model.enums.Education;
import com.trafik.teklif_api.model.enums.Gender;
import com.trafik.teklif_api.model.enums.MaritalStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "drivers")
@Getter
@Setter
public class Driver extends BaseEntity {

  @Column(name = "first_name", nullable = false, length = 80)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 80)
  private String lastName;

  @Column(name = "tc_number", nullable = false, length = 16, unique = true)
  private String tcNumber;

  @Column(name = "birth_date", nullable = false)
  private LocalDate birthDate;

  // FE’de opsiyonel -> nullable
  @Column(name = "license_date")
  private LocalDate licenseDate;

  @Enumerated(EnumType.STRING)
  @Column(name = "gender", length = 8)
  private Gender gender;

  @Enumerated(EnumType.STRING)
  @Column(name = "marital_status", length = 10)
  private MaritalStatus maritalStatus;

  @Enumerated(EnumType.STRING)
  @Column(name = "education", length = 16)
  private Education education;

  @Column(name = "profession", length = 120)
  private String profession;

  @Column(name = "has_accidents", nullable = false)
  private boolean hasAccidents = false;

  @Column(name = "accident_count", nullable = false)
  private int accidentCount = 0;

  @Column(name = "has_violations", nullable = false)
  private boolean hasViolations = false;

  @Column(name = "violation_count", nullable = false)
  private int violationCount = 0;

  @OneToMany(mappedBy = "driver", fetch = FetchType.LAZY)
  private List<Quote> quotes = new ArrayList<>();
}
