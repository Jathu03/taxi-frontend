package com.taxi.device.dto.mapper;

import com.taxi.device.dto.request.DeviceCreateRequest;
import com.taxi.device.dto.response.DeviceDetailResponse;
import com.taxi.device.dto.response.DeviceLogResponse;
import com.taxi.device.dto.response.DeviceResponse;
import com.taxi.device.entity.Device;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DeviceMapper {

    private final DeviceLogMapper deviceLogMapper;

    public DeviceMapper(DeviceLogMapper deviceLogMapper) {
        this.deviceLogMapper = deviceLogMapper;
    }

    public Device toEntity(DeviceCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Device.builder()
                .deviceId(request.getDeviceId())
                .deviceType(request.getDeviceType())
                .deviceModel(request.getDeviceModel())
                .serialNumber(request.getSerialNumber())
                .simNumber(request.getSimNumber())
                .simProvider(request.getSimProvider())
                .vehicleId(request.getVehicleId())
                .driverId(request.getDriverId())
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .installDate(request.getInstallDate())
                .lastActive(request.getLastActive())
                .gpsProvider(request.getGpsProvider())
                .gpsAccountId(request.getGpsAccountId())
                .notes(request.getNotes())
                .build();
    }

    public DeviceResponse toResponse(Device device) {
        if (device == null) {
            return null;
        }

        return DeviceResponse.builder()
                .id(device.getId())
                .deviceId(device.getDeviceId())
                .deviceType(device.getDeviceType())
                .deviceModel(device.getDeviceModel())
                .serialNumber(device.getSerialNumber())
                .simNumber(device.getSimNumber())
                .simProvider(device.getSimProvider())
                .vehicleId(device.getVehicleId())
                .driverId(device.getDriverId())
                .status(device.getStatus())
                .installDate(device.getInstallDate())
                .lastActive(device.getLastActive())
                .gpsProvider(device.getGpsProvider())
                .gpsAccountId(device.getGpsAccountId())
                .notes(device.getNotes())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }

    public DeviceDetailResponse toDetailResponse(Device device) {
        if (device == null) {
            return null;
        }

        List<DeviceLogResponse> recentLogs = Collections.emptyList();
        if (device.getDeviceLogs() != null && !device.getDeviceLogs().isEmpty()) {
            recentLogs = device.getDeviceLogs().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(20)
                    .map(deviceLogMapper::toResponse)
                    .collect(Collectors.toList());
        }

        return DeviceDetailResponse.builder()
                .id(device.getId())
                .deviceId(device.getDeviceId())
                .deviceType(device.getDeviceType())
                .deviceModel(device.getDeviceModel())
                .serialNumber(device.getSerialNumber())
                .simNumber(device.getSimNumber())
                .simProvider(device.getSimProvider())
                .vehicleId(device.getVehicleId())
                .driverId(device.getDriverId())
                .status(device.getStatus())
                .installDate(device.getInstallDate())
                .lastActive(device.getLastActive())
                .gpsProvider(device.getGpsProvider())
                .gpsAccountId(device.getGpsAccountId())
                .notes(device.getNotes())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .recentLogs(recentLogs)
                .build();
    }

    public List<DeviceResponse> toResponseList(List<Device> devices) {
        if (devices == null) {
            return Collections.emptyList();
        }
        return devices.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}