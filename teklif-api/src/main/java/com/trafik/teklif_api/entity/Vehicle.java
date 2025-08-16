package com.trafik.teklif_api.entity;

import com.trafik.teklif_api.model.BaseEntity;
import com.trafik.teklif_api.model.enums.FuelType;
import com.trafik.teklif_api.model.enums.UsageType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "vehicles")
public class Vehicle extends BaseEntity {

    @Column(name = "plate_number", nullable = false, unique = true, length = 16)
    private String plateNumber;

    @Column(nullable = false, length = 60)
    private String brand;

    @Column(nullable = false, length = 60)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "engine_size", nullable = false, length = 20)
    private String engineSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 16)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(name = "usage_type", nullable = false, length = 16)
    private UsageType usage;

    @Column(name = "city_code", nullable = false, length = 10)
    private String cityCode;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Quote> quotes = new ArrayList<>();
}
