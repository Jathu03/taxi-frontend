package com.taxi.vehicle.dto.request;

import lombok.Data;

@Data
public class InsurerCreateRequest {
    private String insurerName;
    private String contactNumber;
    private String email;
    private Boolean isActive;
}