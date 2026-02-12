package com.taxi.promo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for Promo Code Usage response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeUsageResponse {

    private Integer id;
    private Integer promoCodeId;
    private String promoCode;
    private String contactNumber;
    private Integer bookingId;
    private BigDecimal discountApplied;
    private LocalDateTime usedAt;
}