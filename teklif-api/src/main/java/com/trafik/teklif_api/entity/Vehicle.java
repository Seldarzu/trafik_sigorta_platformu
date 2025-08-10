package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "plate_number", nullable = false, unique = true)
    private String plateNumber;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "engine_size")
    private String engineSize;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "usage_type")
    private String usage;

    @Column(name = "city_code")
    private String cityCode;

    @Column(name = "created_at")
    private java.time.OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.OffsetDateTime updatedAt;

    // ❗ Artık OneToOne değil, OneToMany (LAZY)
    @OneToMany(mappedBy = "vehicle", fetch = FetchType.LAZY, cascade = {})
    private List<Quote> quotes = new ArrayList<>();

    public Vehicle() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getEngineSize() { return engineSize; }
    public void setEngineSize(String engineSize) { this.engineSize = engineSize; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getUsage() { return usage; }
    public void setUsage(String usage) { this.usage = usage; }

    public String getCityCode() { return cityCode; }
    public void setCityCode(String cityCode) { this.cityCode = cityCode; }

    public java.time.OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public java.time.OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Quote> getQuotes() { return quotes; }
    public void setQuotes(List<Quote> quotes) { this.quotes = quotes; }
}
