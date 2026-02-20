package com.taxi.vehicle.dto.response;

import com.taxi.vehicle.enums.DeviceStatus;
import com.taxi.vehicle.enums.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Device response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponse {

    private Integer id;
    private String deviceId;
    private DeviceType deviceType;
    private String deviceModel;
    private String serialNumber;
    private String simNumber;
    private String simProvider;

    // Vehicle and Driver info
    private Integer vehicleId;
    private String vehicleCode;
    private String vehicleRegistrationNumber;

    private Integer driverId;
    private String driverCode;
    private String driverName;

    private DeviceStatus status;
    private LocalDate installDate;
    private LocalDateTime lastActive;
    private String gpsProvider;
    private String gpsAccountId;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}