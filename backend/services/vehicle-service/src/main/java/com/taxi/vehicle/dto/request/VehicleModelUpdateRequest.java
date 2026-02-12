package com.taxi.vehicle.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleModelUpdateRequest {

    private Integer makeId;

    @Size(max = 100, message = "Model name must not exceed 100 characters")
    private String model;

    @Size(max = 20, message = "Model code must not exceed 20 characters")
    private String modelCode;

    private String frame;

    private String transmissionType;

    @Size(max = 50, message = "Trim level must not exceed 50 characters")
    private String trimLevel;

    private String fuelType;

    private String turbo;

    private String comments;
}