package com.taxi.promo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for creating a new promo code
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromoCodeRequest {

    @NotBlank(message = "Code is required")
    @Size(max = 50, message = "Code must not exceed 50 characters")
    private String code;

    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    private String description;

    @NotBlank(message = "Discount type is required")
    @Size(max = 20, message = "Discount type must not exceed 20 characters")
    private String discountType; // PERCENTAGE, FIXED

    @NotNull(message = "Discount value is required")
    private BigDecimal discountValue;

    private BigDecimal maxDiscountAmount;

    private BigDecimal minimumFare;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Integer maxUsage;

    private Integer maxUsagePerCustomer;

    private Boolean isFirstTimeOnly = false;

    private Integer minimumHireCount;

    private Integer maxHireCount;

    @Size(max = 20, message = "Applicable to must not exceed 20 characters")
    private String applicableTo = "ALL"; // ALL, CORPORATE

    private Integer corporateId;

    private Set<Integer> vehicleClassIds;

    private Integer createdBy;
}