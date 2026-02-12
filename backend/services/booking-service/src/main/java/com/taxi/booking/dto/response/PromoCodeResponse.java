package com.taxi.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for Promo Code response from Promo Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeResponse {

    private Integer id;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
}