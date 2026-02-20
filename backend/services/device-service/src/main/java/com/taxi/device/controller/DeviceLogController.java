package com.taxi.device.controller;

import com.taxi.device.dto.request.DeviceLogCreateRequest;
import com.taxi.device.dto.response.DeviceLogResponse;
import com.taxi.device.dto.response.PagedResponse;
import com.taxi.device.service.DeviceLogService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/device-logs")
public class DeviceLogController {

    private final DeviceLogService deviceLogService;

    public DeviceLogController(DeviceLogService deviceLogService) {
        this.deviceLogService = deviceLogService;
    }

    // ======================== CREATE ========================

    @PostMapping
    public ResponseEntity<DeviceLogResponse> createDeviceLog(@Valid @RequestBody DeviceLogCreateRequest request) {
        DeviceLogResponse response = deviceLogService.createDeviceLog(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ======================== RETRIEVE ========================

    @GetMapping("/{id}")
    public ResponseEntity<DeviceLogResponse> getDeviceLogById(@PathVariable Integer id) {
        DeviceLogResponse response = deviceLogService.getDeviceLogById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<PagedResponse<DeviceLogResponse>> getLogsByDeviceId(
            @PathVariable Integer deviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceLogResponse> response = deviceLogService.getLogsByDeviceId(
                deviceId, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/device/{deviceId}/type/{logType}")
    public ResponseEntity<PagedResponse<DeviceLogResponse>> getLogsByDeviceIdAndType(
            @PathVariable Integer deviceId,
            @PathVariable String logType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceLogResponse> response = deviceLogService.getLogsByDeviceIdAndType(
                deviceId, logType, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/device/{deviceId}/date-range")
    public ResponseEntity<PagedResponse<DeviceLogResponse>> getLogsByDeviceIdAndDateRange(
            @PathVariable Integer deviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceLogResponse> response = deviceLogService.getLogsByDeviceIdAndDateRange(
                deviceId, startDate, endDate, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/date-range")
    public ResponseEntity<PagedResponse<DeviceLogResponse>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceLogResponse> response = deviceLogService.getLogsByDateRange(
                startDate, endDate, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{logType}")
    public ResponseEntity<PagedResponse<DeviceLogResponse>> getLogsByLogType(
            @PathVariable String logType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceLogResponse> response = deviceLogService.getLogsByLogType(
                logType, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{loggedBy}")
    public ResponseEntity<PagedResponse<DeviceLogResponse>> getLogsByUser(
            @PathVariable Integer loggedBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceLogResponse> response = deviceLogService.getLogsByUser(
                loggedBy, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    // ======================== STATISTICS ========================

    @GetMapping("/device/{deviceId}/stats/type-counts")
    public ResponseEntity<Map<String, Long>> getLogTypeCountsForDevice(@PathVariable Integer deviceId) {
        Map<String, Long> counts = deviceLogService.getLogTypeCountsForDevice(deviceId);
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/device/{deviceId}/stats/count")
    public ResponseEntity<Map<String, Long>> getLogCountForDevice(@PathVariable Integer deviceId) {
        long count = deviceLogService.getLogCountForDevice(deviceId);
        return ResponseEntity.ok(Map.of("totalLogs", count));
    }
}