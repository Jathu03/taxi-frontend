package com.taxi.device.dto.mapper;

import com.taxi.device.dto.request.DeviceLogCreateRequest;
import com.taxi.device.dto.response.DeviceLogResponse;
import com.taxi.device.entity.Device;
import com.taxi.device.entity.DeviceLog;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DeviceLogMapper {

    public DeviceLog toEntity(DeviceLogCreateRequest request, Device device) {
        if (request == null) {
            return null;
        }

        return DeviceLog.builder()
                .device(device)
                .logType(request.getLogType())
                .oldStatus(request.getOldStatus())
                .newStatus(request.getNewStatus())
                .oldVehicleId(request.getOldVehicleId())
                .newVehicleId(request.getNewVehicleId())
                .oldDriverId(request.getOldDriverId())
                .newDriverId(request.getNewDriverId())
                .description(request.getDescription())
                .loggedBy(request.getLoggedBy())
                .build();
    }

    public DeviceLogResponse toResponse(DeviceLog deviceLog) {
        if (deviceLog == null) {
            return null;
        }

        return DeviceLogResponse.builder()
                .id(deviceLog.getId())
                .deviceId(deviceLog.getDevice() != null ? deviceLog.getDevice().getId() : null)
                .deviceIdCode(deviceLog.getDevice() != null ? deviceLog.getDevice().getDeviceId() : null)
                .logType(deviceLog.getLogType())
                .oldStatus(deviceLog.getOldStatus())
                .newStatus(deviceLog.getNewStatus())
                .oldVehicleId(deviceLog.getOldVehicleId())
                .newVehicleId(deviceLog.getNewVehicleId())
                .oldDriverId(deviceLog.getOldDriverId())
                .newDriverId(deviceLog.getNewDriverId())
                .description(deviceLog.getDescription())
                .loggedBy(deviceLog.getLoggedBy())
                .createdAt(deviceLog.getCreatedAt())
                .build();
    }

    public List<DeviceLogResponse> toResponseList(List<DeviceLog> deviceLogs) {
        if (deviceLogs == null) {
            return Collections.emptyList();
        }
        return deviceLogs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}