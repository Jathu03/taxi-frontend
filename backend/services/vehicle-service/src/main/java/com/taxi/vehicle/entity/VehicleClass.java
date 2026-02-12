package com.taxi.vehicle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "class_name", nullable = false, unique = true, length = 50)
    private String className;

    @Column(name = "class_code", length = 20)
    private String classCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_category_id")
    private VehicleCategory vehicleCategory;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate;

    @Column(name = "luggage_capacity", length = 100)
    private String luggageCapacity;

    @Column(name = "no_of_seats")
    private Integer noOfSeats;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "show_in_app", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean showInApp;

    @Column(name = "show_in_web", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean showInWeb;

    @Column(name = "app_order")
    private Integer appOrder;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}