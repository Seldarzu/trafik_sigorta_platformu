package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "vehicle_brands")
public class VehicleBrand {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;
    @Column(unique = true, nullable = false)
    private String name;
    @Column(name = "is_active")
    private boolean isActive = true;
    // Getter/Setter
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
