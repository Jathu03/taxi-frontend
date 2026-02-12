package com.taxi.corporate.dto.response;

import lombok.Data;

@Data
public class VehicleClassResponse {
    private Integer id;
    private String className;
    private String classCode;
    private Integer numberOfSeats;
    private String luggageCapacity;
}