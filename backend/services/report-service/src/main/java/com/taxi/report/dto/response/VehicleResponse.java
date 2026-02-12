package com.taxi.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    private Integer id;
    private String vehicleCode;
    private String registrationNumber;
    private VehicleClassResponse vehicleClass;
    private VehicleMakeResponse make;
    private VehicleModelResponse model;
}