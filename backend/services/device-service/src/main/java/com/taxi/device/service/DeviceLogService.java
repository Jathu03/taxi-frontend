package com.taxi.device.service;

import com.taxi.device.dto.request.DeviceLogCreateRequest;
import com.taxi.device.dto.response.DeviceLogResponse;
import com.taxi.device.dto.response.PagedResponse;

import java.time.LocalDateTime;
import java.util.Map;

public interface DeviceLogService {

    DeviceLogResponse createDeviceLog(DeviceLogCreateRequest request);

    DeviceLogResponse getDeviceLogById(Integer id);

    PagedResponse<DeviceLogResponse> getLogsByDeviceId(Integer deviceId, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DeviceLogResponse> getLogsByDeviceIdAndType(Integer deviceId, String logType,
            int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DeviceLogResponse> getLogsByDeviceIdAndDateRange(Integer deviceId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DeviceLogResponse> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate,
            int page, int size, String sortBy, String sortDir);

    PagedResponse<DeviceLogResponse> getLogsByLogType(String logType, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DeviceLogResponse> getLogsByUser(Integer loggedBy, int page, int size,
            String sortBy, String sortDir);

    Map<String, Long> getLogTypeCountsForDevice(Integer deviceId);

    long getLogCountForDevice(Integer deviceId);
}