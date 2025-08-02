// src/main/java/com/trafik/teklif_api/entity/Driver.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    /** T.C. Kimlik No */
    @Column(name = "tc_number", nullable = false, length = 11)
    private String tcNumber;

    /** Doğum Tarihi */
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    /** Ehliyet Tarihi */
    @Column(name = "license_date")
    private LocalDate licenseDate;

    /** Demografik / Risk Bilgileri */
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

    /** Quote ile ilişki (inverse side) */
    @OneToOne(mappedBy = "driver")
    private Quote quote;

    public Driver() {}

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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

    public Quote getQuote() {
        return quote;
    }
    public void setQuote(Quote quote) {
        this.quote = quote;
    }
}
