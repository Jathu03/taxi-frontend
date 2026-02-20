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
public class VehicleMakeResponse {

    private Integer id;
    private String manufacturer;
    private String manufacturerCode;
    private Integer modelCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}