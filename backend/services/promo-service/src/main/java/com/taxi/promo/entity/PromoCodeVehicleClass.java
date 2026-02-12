package com.taxi.promo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing the relationship between PromoCode and Vehicle Class
 * Maps to 'promo_code_vehicle_classes' table in database
 */
@Entity
@Table(name = "promo_code_vehicle_classes", uniqueConstraints = @UniqueConstraint(columnNames = { "promo_code_id",
        "vehicle_class_id" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeVehicleClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promo_code_id", nullable = false)
    private PromoCode promoCode;

    // Foreign key to vehicle_classes table (managed by Vehicle Service)
    @Column(name = "vehicle_class_id", nullable = false)
    private Integer vehicleClassId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}