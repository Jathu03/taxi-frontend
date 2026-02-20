package com.taxi.farepromo.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FareSchemeResponse {

    private Integer id;
    private String fareCode;
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
    private LocalTime peakHourStartTime;
    private LocalTime peakHourEndTime;
    private BigDecimal peakHourRateHike;
    private BigDecimal offPeakMinRateHike;
    private BigDecimal ratePerKmHike;
    private Integer minimumTime;
    private Integer additionalTimeSlot;
    private BigDecimal ratePerAdditionalTimeSlot;
    private LocalTime nightStartTime;
    private LocalTime nightEndTime;
    private BigDecimal nightRateHike;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}