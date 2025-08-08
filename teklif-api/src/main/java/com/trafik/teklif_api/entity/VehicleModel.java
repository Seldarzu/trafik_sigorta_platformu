package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.OffsetDateTime;

@Entity
@Table(name = "vehicle_models")
public class VehicleModel {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private VehicleBrand brand;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    // --- Getters & Setters ---

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public VehicleBrand getBrand() {
        return brand;
    }

    public void setBrand(VehicleBrand brand) {
        this.brand = brand;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
