package com.taxi.promo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a Promo Code
 * Maps to 'promo_codes' table in database
 */
@Entity
@Table(name = "promo_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "discount_type", nullable = false, length = 20)
    private String discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue = BigDecimal.ZERO;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount = BigDecimal.ZERO;

    @Column(name = "minimum_fare", precision = 10, scale = 2)
    private BigDecimal minimumFare = BigDecimal.ZERO;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "max_usage", columnDefinition = "INT DEFAULT 0")
    private Integer maxUsage = 0;

    @Column(name = "current_usage", columnDefinition = "INT DEFAULT 0")
    private Integer currentUsage = 0;

    @Column(name = "max_usage_per_customer", columnDefinition = "INT DEFAULT 0")
    private Integer maxUsagePerCustomer = 0;

    @Column(name = "is_first_time_only", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isFirstTimeOnly = false;

    @Column(name = "minimum_hire_count", columnDefinition = "INT DEFAULT 0")
    private Integer minimumHireCount = 0;

    @Column(name = "max_hire_count", columnDefinition = "INT DEFAULT 0")
    private Integer maxHireCount = 0;

    @Column(name = "applicable_to", length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'ALL'")
    private String applicableTo = "ALL";

    // Foreign key to corporates table (managed by Corporate Service)
    @Column(name = "corporate_id")
    private Integer corporateId;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive = true;

    // Foreign key to users table (managed by User Service)
    @Column(name = "created_by")
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "promoCode", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<PromoCodeVehicleClass> vehicleClasses = new HashSet<>();
}