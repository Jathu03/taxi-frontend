package com.taxi.driver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Driver Activity Log response
 * Contains activity log information for display
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverActivityLogResponse {

    private Integer id;

    // Driver information
    private Integer driverId;
    private String driverCode;
    private String driverFirstName;
    private String driverLastName;
    private String driverContactNumber;

    private String activityType;

    // Vehicle information (from Vehicle Service)
    private Integer vehicleId;
    private String vehicleCode;
    private String vehicleModel;

    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;

    private LocalDateTime onlineTime;
    private LocalDateTime offlineTime;
    private Integer totalOnlineDuration;

    private LocalDate logDate;
    private LocalDateTime createdAt;
}