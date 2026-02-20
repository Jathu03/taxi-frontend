package com.taxi.driver.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class DriverActivityLogCreateRequest {

    @NotNull(message = "Driver ID is required")
    private Integer driverId;

    @NotBlank(message = "Activity type is required")
    @Size(max = 30, message = "Activity type must not exceed 30 characters")
    private String activityType;

    private Integer vehicleId;

    @Size(max = 50, message = "Vehicle code must not exceed 50 characters")
    private String vehicleCode;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private LocalDateTime onlineTime;

    private LocalDateTime offlineTime;

    private Integer totalOnlineDuration;

    @NotNull(message = "Log date is required")
    private LocalDate logDate;
}