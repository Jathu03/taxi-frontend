package com.taxi.vehicle.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Driver response from Driver Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {

    private Integer id;
    private String code;
    private String firstName;
    private String lastName;
    private String contactNumber;
}