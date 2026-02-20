package com.taxi.vehicle.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InsurerResponse {
    private Integer id;
    private String insurerName;
    private String contactNumber;
    private String email;
    private Boolean isActive;
}