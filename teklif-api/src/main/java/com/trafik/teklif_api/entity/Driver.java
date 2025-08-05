package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "drivers")
public class Driver {
     @Id
     @GeneratedValue(strategy = GenerationType.AUTO)   

    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "tc_number", nullable = false, unique = true, length = 11)
    private String tcNumber;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "license_date")
    private LocalDate licenseDate;

    @Column
    private String gender;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column
    private String education;

    @Column
    private String profession;

    @Column(name = "has_accidents")
    private Boolean hasAccidents = false;

    @Column(name = "accident_count")
    private Integer accidentCount = 0;

    @Column(name = "has_violations")
    private Boolean hasViolations = false;

    @Column(name = "violation_count")
    private Integer violationCount = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    /** Quote ile ilişki (inverse side) */
    @OneToOne(mappedBy = "driver")
    private Quote quote;

    public Driver() {}

    // --- Getters & Setters ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getTcNumber() { return tcNumber; }
    public void setTcNumber(String tcNumber) { this.tcNumber = tcNumber; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public LocalDate getLicenseDate() { return licenseDate; }
    public void setLicenseDate(LocalDate licenseDate) { this.licenseDate = licenseDate; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public Boolean getHasAccidents() { return hasAccidents; }
    public void setHasAccidents(Boolean hasAccidents) { this.hasAccidents = hasAccidents; }

    public Integer getAccidentCount() { return accidentCount; }
    public void setAccidentCount(Integer accidentCount) { this.accidentCount = accidentCount; }

    public Boolean getHasViolations() { return hasViolations; }
    public void setHasViolations(Boolean hasViolations) { this.hasViolations = hasViolations; }

    public Integer getViolationCount() { return violationCount; }
    public void setViolationCount(Integer violationCount) { this.violationCount = violationCount; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Quote getQuote() { return quote; }
    public void setQuote(Quote quote) { this.quote = quote; }
}
