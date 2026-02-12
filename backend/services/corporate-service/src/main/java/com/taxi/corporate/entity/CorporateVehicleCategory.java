package com.taxi.corporate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "corporate_vehicle_categories", uniqueConstraints = @UniqueConstraint(columnNames = { "corporate_id",
        "vehicle_category_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CorporateVehicleCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corporate_id", nullable = false)
    private Corporate corporate;

    @Column(name = "vehicle_category_id", nullable = false)
    private Integer vehicleCategoryId;

    @Column(name = "is_enabled", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isEnabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}