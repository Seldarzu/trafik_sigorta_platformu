// src/main/java/com/trafik/teklif_api/dto/CustomerRequest.java
package com.trafik.teklif_api.dto;

import com.trafik.teklif_api.entity.Status;
import com.trafik.teklif_api.entity.RiskProfile;
import com.trafik.teklif_api.entity.CustomerValue;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CustomerRequest {

    @NotBlank
    @Size(min = 11, max = 11)
    private String tcNumber;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    private LocalDate birthDate;

    @Pattern(regexp = "^\\+?[0-9]*$")
    private String phone;

    @Email
    private String email;

    private String address;
    private String city;

    @NotNull
    private Status status;

    @NotNull
    private RiskProfile riskProfile;

    @NotNull
    private CustomerValue customerValue;

    private String notes;

    public CustomerRequest() {}

    // Tüm alanlar için getter/setter’lar

    public String getTcNumber() { return tcNumber; }
    public void setTcNumber(String tcNumber) { this.tcNumber = tcNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public RiskProfile getRiskProfile() { return riskProfile; }
    public void setRiskProfile(RiskProfile riskProfile) { this.riskProfile = riskProfile; }

    public CustomerValue getCustomerValue() { return customerValue; }
    public void setCustomerValue(CustomerValue customerValue) { this.customerValue = customerValue; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
