package com.taxi.farepromo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promo_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "discount_type", nullable = false, length = 20)
    private String discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "minimum_fare", precision = 10, scale = 2)
    private BigDecimal minimumFare;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "max_usage")
    private Integer maxUsage;

    @Column(name = "current_usage")
    private Integer currentUsage;

    @Column(name = "max_usage_per_customer")
    private Integer maxUsagePerCustomer;

    @Column(name = "is_first_time_only", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isFirstTimeOnly;

    @Column(name = "minimum_hire_count")
    private Integer minimumHireCount;

    @Column(name = "max_hire_count")
    private Integer maxHireCount;

    @Column(name = "applicable_to", length = 20)
    private String applicableTo;

    @Column(name = "corporate_id")
    private Integer corporateId;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive;

    @Column(name = "created_by")
    private Integer createdBy;

    @OneToMany(mappedBy = "promoCode", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PromoCodeVehicleClass> vehicleClasses = new ArrayList<>();

    @OneToMany(mappedBy = "promoCode", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PromoCodeUsage> usages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (isActive == null)
            isActive = true;
        if (isFirstTimeOnly == null)
            isFirstTimeOnly = false;
        if (currentUsage == null)
            currentUsage = 0;
        if (maxUsage == null)
            maxUsage = 0;
        if (maxUsagePerCustomer == null)
            maxUsagePerCustomer = 0;
        if (minimumHireCount == null)
            minimumHireCount = 0;
        if (maxHireCount == null)
            maxHireCount = 0;
        if (applicableTo == null)
            applicableTo = "ALL";
    }
}