package com.taxi.farepromo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeUsageRequest {

    @NotNull(message = "Promo code ID is required")
    private Integer promoCodeId;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    private Integer bookingId;

    private BigDecimal discountApplied;
}