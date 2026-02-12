package com.taxi.vehicle.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleModelCreateRequest {

    @NotNull(message = "Make ID is required")
    private Integer makeId;

    @NotBlank(message = "Model name is required")
    @Size(max = 100, message = "Model name must not exceed 100 characters")
    private String model;

    @Size(max = 20, message = "Model code must not exceed 20 characters")
    private String modelCode;

    private String frame; // Accepts enum string e.g. "SEDAN"

    private String transmissionType; // Accepts enum string e.g. "AUTOMATIC"

    @Size(max = 50, message = "Trim level must not exceed 50 characters")
    private String trimLevel;

    private String fuelType; // Accepts enum string e.g. "PETROL"

    private String turbo; // Accepts enum string e.g. "NONE"

    private String comments;
}