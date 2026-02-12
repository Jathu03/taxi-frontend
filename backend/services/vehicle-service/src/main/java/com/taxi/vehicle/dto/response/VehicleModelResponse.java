package com.taxi.vehicle.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleModelResponse {

    private Integer id;
    private Integer makeId;
    private String makeName;
    private String model;
    private String modelCode;
    private String frame;
    private String transmissionType;
    private String trimLevel;
    private String fuelType;
    private String turbo;
    private String comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}