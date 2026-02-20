package com.taxi.vehicle.entity;

import com.taxi.vehicle.enums.FrameType;
import com.taxi.vehicle.enums.FuelType;
import com.taxi.vehicle.enums.TransmissionType;
import com.taxi.vehicle.enums.TurboType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "make_id", nullable = false)
    private VehicleMake make;

    @Column(name = "model", nullable = false, length = 100)
    private String model;

    @Column(name = "model_code", length = 20)
    private String modelCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "frame", length = 50)
    private FrameType frame;

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission_type", length = 20)
    private TransmissionType transmissionType;

    @Column(name = "trim_level", length = 50)
    private String trimLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", length = 20)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(name = "turbo", length = 50)
    private TurboType turbo;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}