// src/main/java/com/trafik/teklif_api/entity/Driver.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
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

    @Column(name = "has_accidents", nullable = false)
    private Boolean hasAccidents = false;

    @Column(name = "accident_count", nullable = false)
    private Integer accidentCount = 0;

    @Column(name = "has_violations", nullable = false)
    private Boolean hasViolations = false;

    @Column(name = "violation_count", nullable = false)
    private Integer violationCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private OffsetDateTime updatedAt;

    @OneToOne(mappedBy = "driver")
    private Quote quote;

    public Driver() {}

    public UUID getId() {
        return id;
    }

    // --- Getters & Setters for all other fields ---

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getTcNumber() {
        return tcNumber;
    }
    public void setTcNumber(String tcNumber) {
        this.tcNumber = tcNumber;
    }
    public LocalDate getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
    public LocalDate getLicenseDate() {
        return licenseDate;
    }
    public void setLicenseDate(LocalDate licenseDate) {
        this.licenseDate = licenseDate;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getMaritalStatus() {
        return maritalStatus;
    }
    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }
    public String getEducation() {
        return education;
    }
    public void setEducation(String education) {
        this.education = education;
    }
    public String getProfession() {
        return profession;
    }
    public void setProfession(String profession) {
        this.profession = profession;
    }
    public Boolean getHasAccidents() {
        return hasAccidents;
    }
    public void setHasAccidents(Boolean hasAccidents) {
        this.hasAccidents = hasAccidents;
    }
    public Integer getAccidentCount() {
        return accidentCount;
    }
    public void setAccidentCount(Integer accidentCount) {
        this.accidentCount = accidentCount;
    }
    public Boolean getHasViolations() {
        return hasViolations;
    }
    public void setHasViolations(Boolean hasViolations) {
        this.hasViolations = hasViolations;
    }
    public Integer getViolationCount() {
        return violationCount;
    }
    public void setViolationCount(Integer violationCount) {
        this.violationCount = violationCount;
    }
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    public Quote getQuote() {
        return quote;
    }
    public void setQuote(Quote quote) {
        this.quote = quote;
    }
}
