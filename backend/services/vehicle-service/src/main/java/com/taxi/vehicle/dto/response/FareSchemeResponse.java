package com.taxi.vehicle.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Fare Scheme response from Fare Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FareSchemeResponse {

    private Integer id;
    private String fareCode;
    private String fareName;
    private String description;
}