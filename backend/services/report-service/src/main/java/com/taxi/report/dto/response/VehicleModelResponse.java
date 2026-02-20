package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleModelResponse {
    private Integer id;
    private String model;
    private String modelCode;
    private String frame;
    private String fuelType;
}