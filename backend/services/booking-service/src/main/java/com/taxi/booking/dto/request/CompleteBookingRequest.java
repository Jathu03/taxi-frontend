package com.taxi.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for completing a booking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteBookingRequest {

    @NotNull(message = "Completed time is required")
    private LocalDateTime completedTime;

    @NotNull(message = "Total distance is required")
    private BigDecimal totalDistance;

    private Integer totalWaitTime;
    private Integer billedWaitTime;
    private BigDecimal totalWaitingFee;

    @NotNull(message = "Total fare is required")
    private BigDecimal totalFare;

    private BigDecimal baseFare;
    private BigDecimal distanceFare;
    private BigDecimal timeFare;
    private BigDecimal surgeFee;

    private Boolean sendClientSms = true;

    // Odometer readings
    private BigDecimal startOdometer;
    private BigDecimal endOdometer;
}