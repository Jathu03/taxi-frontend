package com.taxi.driver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverActivityLogResponse {

    private Integer id;
    private Integer driverId;
    private String driverCode;
    private String driverName;
    private String activityType;
    private Integer vehicleId;
    private String vehicleCode;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDateTime onlineTime;
    private LocalDateTime offlineTime;
    private Integer totalOnlineDuration;
    private LocalDate logDate;
    private LocalDateTime createdAt;
}