package com.taxi.promo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for Promo Code response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeResponse {

    private Integer id;
    private String code;
    private String name;
    private String description;

    // Vehicle class information (from Vehicle Service)
    private Set<VehicleClassResponse> vehicleClasses;

    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minimumFare;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer maxUsage;
    private Integer currentUsage;
    private Integer maxUsagePerCustomer;

    private Boolean isFirstTimeOnly;
    private Integer minimumHireCount;
    private Integer maxHireCount;

    private String applicableTo;

    // Corporate information (from Corporate Service)
    private Integer corporateId;
    private String corporateName;

    private Boolean isActive;

    private Integer createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}