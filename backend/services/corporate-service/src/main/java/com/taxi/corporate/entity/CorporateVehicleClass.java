package com.taxi.corporate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "corporate_vehicle_classes", uniqueConstraints = @UniqueConstraint(columnNames = { "corporate_id",
        "vehicle_class_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CorporateVehicleClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corporate_id", nullable = false)
    private Corporate corporate;

    // Store vehicle class ID only - fetch details from Vehicle-Service via Feign
    @Column(name = "vehicle_class_id", nullable = false)
    private Integer vehicleClassId;

    @Column(name = "is_enabled", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isEnabled = true;

    @Column(name = "custom_rate", precision = 8, scale = 2)
    private BigDecimal customRate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}