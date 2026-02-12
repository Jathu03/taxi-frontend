package com.taxi.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for dispatching a booking to a driver/vehicle
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DispatchBookingRequest {

    @NotNull(message = "Driver is required")
    private Integer driverId;

    @NotNull(message = "Vehicle is required")
    private Integer vehicleId;

    private Integer dispatchedBy;

    // Optional fields that can be updated during dispatch
    private String passengerName;
    private Integer numberOfPassengers;
    private BigDecimal luggage;
    private String remarks;
    private String specialRemarks;
    private BigDecimal percentage;
}