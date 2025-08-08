// src/main/java/com/trafik/teklif_api/dto/CustomerResponse.java
package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.entity.Status;
import com.trafik.teklif_api.entity.RiskProfile;
import com.trafik.teklif_api.entity.CustomerValue;
import java.time.LocalDate;
import java.util.UUID;

public class CustomerResponse {

    private UUID id;
    private String tcNumber;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String phone;
    private String email;
    private String address;
    private String city;
    private Status status;
    private String notes;
    private LocalDate registrationDate;
    private RiskProfile riskProfile;
    private CustomerValue customerValue;

    public CustomerResponse(UUID id,
                            String tcNumber,
                            String firstName,
                            String lastName,
                            LocalDate birthDate,
                            String phone,
                            String email,
                            String address,
                            String city,
                            Status status,
                            String notes,
                            LocalDate registrationDate,
                            RiskProfile riskProfile,
                            CustomerValue customerValue) {
        this.id = id;
        this.tcNumber = tcNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.city = city;
        this.status = status;
        this.notes = notes;
        this.registrationDate = registrationDate;
        this.riskProfile = riskProfile;
        this.customerValue = customerValue;
    }

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }

    public String getTcNumber() {
        return tcNumber;
    }
    public void setTcNumber(String tcNumber) {
        this.tcNumber = tcNumber;
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

    public LocalDate getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }
    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public RiskProfile getRiskProfile() {
        return riskProfile;
    }
    public void setRiskProfile(RiskProfile riskProfile) {
        this.riskProfile = riskProfile;
    }

    public CustomerValue getCustomerValue() {
        return customerValue;
    }
    public void setCustomerValue(CustomerValue customerValue) {
        this.customerValue = customerValue;
    }
}
