package com.taxi.farepromo.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PromoCodeUsageResponse {

    private Integer id;
    private Integer promoCodeId;
    private String promoCode;
    private String contactNumber;
    private Integer bookingId;
    private BigDecimal discountApplied;
    private LocalDateTime usedAt;
}