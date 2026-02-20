package com.taxi.farepromo.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PromoCodeResponse {

    private Integer id;
    private String code;
    private String name;
    private String description;
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
    private Integer corporateId;
    private Boolean isActive;
    private Integer createdBy;
    private List<Integer> vehicleClassIds;
    private BigDecimal totalDiscountGiven;
    private Integer uniqueCustomers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}