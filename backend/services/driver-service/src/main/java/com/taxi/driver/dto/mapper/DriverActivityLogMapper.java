package com.taxi.driver.dto.mapper;

import com.taxi.driver.dto.request.DriverActivityLogCreateRequest;
import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.entity.Driver;
import com.taxi.driver.entity.DriverActivityLog;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DriverActivityLogMapper {

    public DriverActivityLog toEntity(DriverActivityLogCreateRequest request, Driver driver) {
        if (request == null) {
            return null;
        }

        return DriverActivityLog.builder()
                .driver(driver)
                .activityType(request.getActivityType())
                .vehicleId(request.getVehicleId())
                .vehicleCode(request.getVehicleCode())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .onlineTime(request.getOnlineTime())
                .offlineTime(request.getOfflineTime())
                .totalOnlineDuration(request.getTotalOnlineDuration())
                .logDate(request.getLogDate())
                .build();
    }

    public DriverActivityLogResponse toResponse(DriverActivityLog log) {
        if (log == null) {
            return null;
        }

        String driverName = null;
        String driverCode = null;
        if (log.getDriver() != null) {
            driverCode = log.getDriver().getCode();
            driverName = log.getDriver().getFirstName();
            if (log.getDriver().getLastName() != null && !log.getDriver().getLastName().isBlank()) {
                driverName += " " + log.getDriver().getLastName();
            }
        }

        return DriverActivityLogResponse.builder()
                .id(log.getId())
                .driverId(log.getDriver() != null ? log.getDriver().getId() : null)
                .driverCode(driverCode)
                .driverName(driverName)
                .activityType(log.getActivityType())
                .vehicleId(log.getVehicleId())
                .vehicleCode(log.getVehicleCode())
                .location(log.getLocation())
                .latitude(log.getLatitude())
                .longitude(log.getLongitude())
                .onlineTime(log.getOnlineTime())
                .offlineTime(log.getOfflineTime())
                .totalOnlineDuration(log.getTotalOnlineDuration())
                .logDate(log.getLogDate())
                .createdAt(log.getCreatedAt())
                .build();
    }

    public List<DriverActivityLogResponse> toResponseList(List<DriverActivityLog> logs) {
        if (logs == null) {
            return Collections.emptyList();
        }
        return logs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}