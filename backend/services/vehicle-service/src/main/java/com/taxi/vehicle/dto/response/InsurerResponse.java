package com.taxi.vehicle.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Insurer response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsurerResponse {

    private Integer id;
    private String insurerName;
    private String contactNumber;
    private String email;
    private Boolean isActive;
}