package com.taxi.vehicle.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleMakeCreateRequest {

    @NotBlank(message = "Manufacturer name is required")
    @Size(max = 100, message = "Manufacturer name must not exceed 100 characters")
    private String manufacturer;

    @Size(max = 20, message = "Manufacturer code must not exceed 20 characters")
    private String manufacturerCode;
}