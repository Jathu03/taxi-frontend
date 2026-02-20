package com.taxi.device.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponse {

    private Integer id;
    private String deviceId;
    private String deviceType;
    private String deviceModel;
    private String serialNumber;
    private String simNumber;
    private String simProvider;
    private Integer vehicleId;
    private Integer driverId;
    private String status;
    private LocalDate installDate;
    private LocalDateTime lastActive;
    private String gpsProvider;
    private String gpsAccountId;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}