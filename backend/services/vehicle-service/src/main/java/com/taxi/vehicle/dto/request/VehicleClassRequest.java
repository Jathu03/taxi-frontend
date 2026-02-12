package com.taxi.vehicle.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleClassRequest {

    private String className;
    private String classCode;
    private Integer categoryId;

    // These were missing previously causing your error
    private BigDecimal commissionRate;
    private String luggageCapacity;
    private Integer noOfSeats;
    private String description;
    private Boolean showInApp;
    private Boolean showInWeb;
    private Integer appOrder;
    private String imageUrl;
}