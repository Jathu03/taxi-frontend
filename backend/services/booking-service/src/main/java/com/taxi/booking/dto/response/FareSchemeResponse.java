package com.taxi.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for Fare Scheme response from Fare Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FareSchemeResponse {

    private Integer id;
    private String fareCode;
    private String fareName;
    private BigDecimal minimumRate;
    private BigDecimal ratePerKm;
    private BigDecimal waitingChargePerMin;
}