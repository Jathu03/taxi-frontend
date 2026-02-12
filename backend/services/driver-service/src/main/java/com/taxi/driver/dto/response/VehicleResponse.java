package com.taxi.driver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Vehicle response from Vehicle Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {

    private Integer id;
    private String vehicleCode;
    private String registrationNumber;
    private String manufacturer;
    private String model;
    private String vehicleClass;
}