package com.taxi.vehicle.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleClassResponse {

    private Integer id;
    private String className;
    private String classCode;
    private String categoryName;

    // Full details needed for Management UI
    private BigDecimal commissionRate;
    private String luggageCapacity;
    private Integer noOfSeats;
    private String description;
    private Boolean showInApp;
    private Boolean showInWeb;
    private Integer appOrder;
    private String imageUrl;

    // ADD THESE NEW FIELDS
    private Integer fareSchemeId;
    private Integer corporateFareSchemeId;
    private Integer roadTripFareSchemeId;
    private Integer appFareSchemeId;

    private String vehicleImagePrimary;
    private String vehicleImageSecondary;
    private String vehicleImageTertiary;

    private String comments;

    // Dates for the UI table
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}