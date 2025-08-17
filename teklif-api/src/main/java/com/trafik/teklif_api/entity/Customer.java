package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import com.trafik.teklif_api.model.enums.CustomerStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Birleştirilmiş Customer entity
 * - BaseEntity kalıtımı ve metrik alanları (totalPolicies, totalPremium, loyaltyPoints vb.)
 * - Risk & değer profilleri
 * - Son seçilen şirket bilgisi (preferredCompany*) -> DB kolonları: last_company_*
 */
@Entity
@Table(name = "customers")
@Getter
@Setter
public class Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "tc_number", nullable = false, length = 16, unique = true)
    private String tcNumber;

    @Column(name = "first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 80)
    private String lastName;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "phone", length = 32)
    private String phone;

    @Column(name = "email", length = 160)
    private String email;

    @Column(name = "address", length = 500, nullable = false)
    private String address;

    @Column(name = "city", length = 100, nullable = false)
    private String city;

    @Column(name = "registration_date", nullable = false, updatable = false, insertable = false)
    private LocalDate registrationDate = LocalDate.now();

    @Column(name = "total_policies", nullable = false)
    private int totalPolicies = 0;

    @Column(name = "total_premium", nullable = false)
    private double totalPremium = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private CustomerStatus status = CustomerStatus.POTENTIAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_profile", nullable = false)
    private RiskProfile riskProfile = RiskProfile.LOW;

    @Convert(converter = CustomerValueConverter.class)
    @Column(name = "customer_value", nullable = false, length = 16)
    private CustomerValue customerValue = CustomerValue.BRONZE;

    @Column(name = "loyalty_points", nullable = false)
    private int loyaltyPoints = 0;

    @Column(name = "notes", columnDefinition = "text")
    private String notes = "";

    /** 
     * Son/tercih edilen sigorta şirketi bilgisi.
     * DB’deki kolon isimlerini koruyoruz: last_company_id / last_company_name
     * Serviste kullanılan alan isimleriyle (preferredCompany*) uyumlu getter/setter üretilsin diye
     * alan adlarını preferredCompany* tuttuk.
     */
    @Column(name = "last_company_id")
    private UUID preferredCompanyId;

    @Column(name = "last_company_name", length = 255)
    private String preferredCompanyName;
}
