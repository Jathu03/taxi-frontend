package com.taxi.farepromo.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeUpdateRequest {

    @Size(max = 50, message = "Promo code must not exceed 50 characters")
    private String code;

    @Size(max = 100, message = "Promo name must not exceed 100 characters")
    private String name;

    private String description;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minimumFare;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxUsage;
    private Integer maxUsagePerCustomer;
    private Boolean isFirstTimeOnly;
    private Integer minimumHireCount;
    private Integer maxHireCount;
    private String applicableTo;
    private Integer corporateId;
    private Boolean isActive;

    // Updated vehicle class IDs
    private List<Integer> vehicleClassIds;
}