package com.taxi.booking.dto.response;

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
    private Integer vehicleId;
    private String vehicleCode;
    private Integer userId;
    private Boolean isActive;
    private Boolean isBlocked;
}