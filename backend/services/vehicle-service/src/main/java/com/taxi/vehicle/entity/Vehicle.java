package com.taxi.vehicle.entity;

import com.taxi.vehicle.enums.FuelType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "vehicle_code", nullable = false, unique = true, length = 50)
    private String vehicleCode;

    @Column(name = "registration_number", nullable = false, unique = true, length = 20)
    private String registrationNumber;

    @Column(name = "chassis_number", length = 50)
    private String chassisNumber;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "revenue_license_number", length = 50)
    private String revenueLicenseNumber;

    @Column(name = "revenue_license_expiry_date")
    private LocalDate revenueLicenseExpiryDate;

    @Column(name = "passenger_capacity")
    private Integer passengerCapacity;

    @Column(name = "luggage_capacity")
    private Integer luggageCapacity;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "make_id")
    private VehicleMake make;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private VehicleModel model;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", length = 20)
    private FuelType fuelType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurer_id")
    private Insurer insurer;

    @Column(name = "insurance_number", length = 50)
    private String insuranceNumber;

    @Column(name = "insurance_expiry_date")
    private LocalDate insuranceExpiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private VehicleOwner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private VehicleClass vehicleClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "fare_scheme_id")
    private Integer fareSchemeId;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}