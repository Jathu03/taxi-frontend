package com.taxi.device.dto.request;

import jakarta.validation.constraints.Size;
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
public class DeviceUpdateRequest {

    @Size(max = 30, message = "Device type must not exceed 30 characters")
    private String deviceType;

    @Size(max = 100, message = "Device model must not exceed 100 characters")
    private String deviceModel;

    @Size(max = 100, message = "Serial number must not exceed 100 characters")
    private String serialNumber;

    @Size(max = 20, message = "SIM number must not exceed 20 characters")
    private String simNumber;

    @Size(max = 50, message = "SIM provider must not exceed 50 characters")
    private String simProvider;

    private Integer vehicleId;

    private Integer driverId;

    @Size(max = 20, message = "Status must not exceed 20 characters")
    private String status;

    private LocalDate installDate;

    private LocalDateTime lastActive;

    @Size(max = 100, message = "GPS provider must not exceed 100 characters")
    private String gpsProvider;

    @Size(max = 100, message = "GPS account ID must not exceed 100 characters")
    private String gpsAccountId;

    private String notes;

    private Integer loggedBy;

    private String changeDescription;
}