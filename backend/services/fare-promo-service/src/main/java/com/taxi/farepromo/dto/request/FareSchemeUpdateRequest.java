package com.taxi.farepromo.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FareSchemeUpdateRequest {

    @Size(max = 50, message = "Fare code must not exceed 50 characters")
    private String fareCode;

    @Size(max = 100, message = "Fare name must not exceed 100 characters")
    private String fareName;

    private String description;
    private Integer vehicleClassId;
    private Boolean isMetered;
    private Boolean isPackage;
    private BigDecimal minimumDistance;
    private BigDecimal minimumRate;
    private BigDecimal ratePerKm;
    private Integer freeWaitTime;
    private BigDecimal waitingChargePerMin;
    private String peakHourStartTime;
    private String peakHourEndTime;
    private BigDecimal peakHourRateHike;
    private BigDecimal offPeakMinRateHike;
    private BigDecimal ratePerKmHike;
    private Integer minimumTime;
    private Integer additionalTimeSlot;
    private BigDecimal ratePerAdditionalTimeSlot;
    private String nightStartTime;
    private String nightEndTime;
    private BigDecimal nightRateHike;
    private String status;
}