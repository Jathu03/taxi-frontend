package com.taxi.booking.dto.response;

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
    private Integer classId;
    private String className;
}