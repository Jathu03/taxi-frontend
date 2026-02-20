package com.taxi.device.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceLogCreateRequest {

    @NotNull(message = "Device ID is required")
    private Integer deviceId;

    @NotBlank(message = "Log type is required")
    @Size(max = 30, message = "Log type must not exceed 30 characters")
    private String logType;

    @Size(max = 20, message = "Old status must not exceed 20 characters")
    private String oldStatus;

    @Size(max = 20, message = "New status must not exceed 20 characters")
    private String newStatus;

    private Integer oldVehicleId;

    private Integer newVehicleId;

    private Integer oldDriverId;

    private Integer newDriverId;

    private String description;

    private Integer loggedBy;
}