package com.taxi.farepromo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Vehicle Class response from Vehicle Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleClassResponse {

    private Integer id;
    private String className;
    private String classCode;
    private Integer noOfSeats;
}