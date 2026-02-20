package com.taxi.device.controller;

import com.taxi.device.dto.request.DeviceCreateRequest;
import com.taxi.device.dto.request.DeviceUpdateRequest;
import com.taxi.device.dto.response.DeviceDetailResponse;
import com.taxi.device.dto.response.DeviceResponse;
import com.taxi.device.dto.response.PagedResponse;
import com.taxi.device.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // ======================== CRUD OPERATIONS ========================

    @PostMapping
    public ResponseEntity<DeviceResponse> createDevice(@Valid @RequestBody DeviceCreateRequest request) {
        DeviceResponse response = deviceService.createDevice(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceResponse> updateDevice(@PathVariable Integer id,
            @Valid @RequestBody DeviceUpdateRequest request) {
        DeviceResponse response = deviceService.updateDevice(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDetailResponse> getDeviceById(@PathVariable Integer id) {
        DeviceDetailResponse response = deviceService.getDeviceById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-device-id/{deviceId}")
    public ResponseEntity<DeviceDetailResponse> getDeviceByDeviceId(@PathVariable String deviceId) {
        DeviceDetailResponse response = deviceService.getDeviceByDeviceId(deviceId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Integer id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }

    // ======================== LIST & SEARCH ========================

    @GetMapping
    public ResponseEntity<PagedResponse<DeviceResponse>> getAllDevices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceResponse> response = deviceService.getAllDevices(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<PagedResponse<DeviceResponse>> getDevicesByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceResponse> response = deviceService.getDevicesByStatus(status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{deviceType}")
    public ResponseEntity<PagedResponse<DeviceResponse>> getDevicesByType(
            @PathVariable String deviceType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceResponse> response = deviceService.getDevicesByType(deviceType, page, size, sortBy,
                sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<DeviceResponse>> searchDevices(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceResponse> response = deviceService.searchDevices(keyword, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    public ResponseEntity<PagedResponse<DeviceResponse>> getDevicesByFilters(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String deviceType,
            @RequestParam(required = false) Integer vehicleId,
            @RequestParam(required = false) Integer driverId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DeviceResponse> response = deviceService.getDevicesByFilters(
                status, deviceType, vehicleId, driverId, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    // ======================== SPECIAL QUERIES ========================

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<DeviceResponse>> getDevicesByVehicleId(@PathVariable Integer vehicleId) {
        List<DeviceResponse> response = deviceService.getDevicesByVehicleId(vehicleId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<DeviceResponse>> getDevicesByDriverId(@PathVariable Integer driverId) {
        List<DeviceResponse> response = deviceService.getDevicesByDriverId(driverId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<DeviceResponse>> getUnassignedDevices() {
        List<DeviceResponse> response = deviceService.getUnassignedDevices();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<DeviceResponse>> getInactiveDevices(
            @RequestParam(defaultValue = "24") int hoursThreshold) {
        List<DeviceResponse> response = deviceService.getInactiveDevices(hoursThreshold);
        return ResponseEntity.ok(response);
    }

    // ======================== STATUS & ASSIGNMENT ========================

    @PatchMapping("/{id}/status")
    public ResponseEntity<DeviceResponse> updateDeviceStatus(
            @PathVariable Integer id,
            @RequestParam String status,
            @RequestParam(required = false) Integer loggedBy,
            @RequestParam(required = false) String description) {
        DeviceResponse response = deviceService.updateDeviceStatus(id, status, loggedBy, description);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign-vehicle")
    public ResponseEntity<DeviceResponse> assignVehicle(
            @PathVariable Integer id,
            @RequestParam Integer vehicleId,
            @RequestParam(required = false) Integer loggedBy,
            @RequestParam(required = false) String description) {
        DeviceResponse response = deviceService.assignVehicle(id, vehicleId, loggedBy, description);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign-driver")
    public ResponseEntity<DeviceResponse> assignDriver(
            @PathVariable Integer id,
            @RequestParam Integer driverId,
            @RequestParam(required = false) Integer loggedBy,
            @RequestParam(required = false) String description) {
        DeviceResponse response = deviceService.assignDriver(id, driverId, loggedBy, description);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/unassign-vehicle")
    public ResponseEntity<DeviceResponse> unassignVehicle(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer loggedBy,
            @RequestParam(required = false) String description) {
        DeviceResponse response = deviceService.unassignVehicle(id, loggedBy, description);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/unassign-driver")
    public ResponseEntity<DeviceResponse> unassignDriver(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer loggedBy,
            @RequestParam(required = false) String description) {
        DeviceResponse response = deviceService.unassignDriver(id, loggedBy, description);
        return ResponseEntity.ok(response);
    }

    // ======================== STATISTICS ========================

    @GetMapping("/stats/status-counts")
    public ResponseEntity<Map<String, Long>> getDeviceStatusCounts() {
        Map<String, Long> counts = deviceService.getDeviceStatusCounts();
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/stats/type-counts")
    public ResponseEntity<Map<String, Long>> getDeviceTypeCounts() {
        Map<String, Long> counts = deviceService.getDeviceTypeCounts();
        return ResponseEntity.ok(counts);
    }
}