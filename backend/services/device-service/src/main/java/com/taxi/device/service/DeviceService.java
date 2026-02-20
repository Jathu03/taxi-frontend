package com.taxi.device.service;

import com.taxi.device.dto.request.DeviceCreateRequest;
import com.taxi.device.dto.request.DeviceUpdateRequest;
import com.taxi.device.dto.response.DeviceDetailResponse;
import com.taxi.device.dto.response.DeviceResponse;
import com.taxi.device.dto.response.PagedResponse;

import java.util.List;
import java.util.Map;

public interface DeviceService {

    DeviceResponse createDevice(DeviceCreateRequest request);

    DeviceResponse updateDevice(Integer id, DeviceUpdateRequest request);

    DeviceDetailResponse getDeviceById(Integer id);

    DeviceDetailResponse getDeviceByDeviceId(String deviceId);

    PagedResponse<DeviceResponse> getAllDevices(int page, int size, String sortBy, String sortDir);

    PagedResponse<DeviceResponse> getDevicesByStatus(String status, int page, int size, String sortBy, String sortDir);

    PagedResponse<DeviceResponse> getDevicesByType(String deviceType, int page, int size, String sortBy,
            String sortDir);

    PagedResponse<DeviceResponse> searchDevices(String keyword, int page, int size, String sortBy, String sortDir);

    PagedResponse<DeviceResponse> getDevicesByFilters(String status, String deviceType, Integer vehicleId,
            Integer driverId, int page, int size,
            String sortBy, String sortDir);

    List<DeviceResponse> getDevicesByVehicleId(Integer vehicleId);

    List<DeviceResponse> getDevicesByDriverId(Integer driverId);

    List<DeviceResponse> getUnassignedDevices();

    List<DeviceResponse> getInactiveDevices(int hoursThreshold);

    DeviceResponse updateDeviceStatus(Integer id, String newStatus, Integer loggedBy, String description);

    DeviceResponse assignVehicle(Integer id, Integer vehicleId, Integer loggedBy, String description);

    DeviceResponse assignDriver(Integer id, Integer driverId, Integer loggedBy, String description);

    DeviceResponse unassignVehicle(Integer id, Integer loggedBy, String description);

    DeviceResponse unassignDriver(Integer id, Integer loggedBy, String description);

    void deleteDevice(Integer id);

    Map<String, Long> getDeviceStatusCounts();

    Map<String, Long> getDeviceTypeCounts();
}