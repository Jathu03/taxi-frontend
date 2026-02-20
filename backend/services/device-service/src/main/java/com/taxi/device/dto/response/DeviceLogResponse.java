package com.taxi.device.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceLogResponse {

    private Integer id;
    private Integer deviceId;
    private String deviceIdCode;
    private String logType;
    private String oldStatus;
    private String newStatus;
    private Integer oldVehicleId;
    private Integer newVehicleId;
    private Integer oldDriverId;
    private Integer newDriverId;
    private String description;
    private Integer loggedBy;
    private LocalDateTime createdAt;
}