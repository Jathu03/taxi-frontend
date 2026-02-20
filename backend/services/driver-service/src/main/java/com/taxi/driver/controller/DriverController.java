package com.taxi.driver.controller;

import com.taxi.driver.dto.request.DriverBlockRequest;
import com.taxi.driver.dto.request.DriverCreateRequest;
import com.taxi.driver.dto.request.DriverUpdateRequest;
import com.taxi.driver.dto.response.DriverDetailResponse;
import com.taxi.driver.dto.response.DriverResponse;
import com.taxi.driver.dto.response.PagedResponse;
import com.taxi.driver.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // ======================== CRUD OPERATIONS ========================

    @PostMapping
    public ResponseEntity<DriverResponse> createDriver(@Valid @RequestBody DriverCreateRequest request) {
        DriverResponse response = driverService.createDriver(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverResponse> updateDriver(@PathVariable Integer id,
            @Valid @RequestBody DriverUpdateRequest request) {
        DriverResponse response = driverService.updateDriver(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverDetailResponse> getDriverById(@PathVariable Integer id) {
        DriverDetailResponse response = driverService.getDriverById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<DriverDetailResponse> getDriverByCode(@PathVariable String code) {
        DriverDetailResponse response = driverService.getDriverByCode(code);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/contact/{contactNumber}")
    public ResponseEntity<DriverDetailResponse> getDriverByContactNumber(@PathVariable String contactNumber) {
        DriverDetailResponse response = driverService.getDriverByContactNumber(contactNumber);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Integer id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

    // ======================== LIST & SEARCH ========================

    @GetMapping
    public ResponseEntity<PagedResponse<DriverResponse>> getAllDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getAllDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<PagedResponse<DriverResponse>> getActiveDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getActiveDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/blocked")
    public ResponseEntity<PagedResponse<DriverResponse>> getBlockedDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getBlockedDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verified")
    public ResponseEntity<PagedResponse<DriverResponse>> getVerifiedDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getVerifiedDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unverified")
    public ResponseEntity<PagedResponse<DriverResponse>> getUnverifiedDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getUnverifiedDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<PagedResponse<DriverResponse>> getDriversByCompany(
            @PathVariable Integer companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getDriversByCompany(
                companyId, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<DriverResponse>> searchDrivers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.searchDrivers(keyword, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    public ResponseEntity<PagedResponse<DriverResponse>> getDriversByFilters(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isBlocked,
            @RequestParam(required = false) Boolean isVerified,
            @RequestParam(required = false) Integer companyId,
            @RequestParam(required = false) Boolean manualDispatchOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getDriversByFilters(
                isActive, isBlocked, isVerified, companyId, manualDispatchOnly,
                page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unassigned")
    public ResponseEntity<PagedResponse<DriverResponse>> getUnassignedDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getUnassignedDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    public ResponseEntity<PagedResponse<DriverResponse>> getAvailableDrivers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<DriverResponse> response = driverService.getAvailableDrivers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    // ======================== SPECIAL QUERIES ========================

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<DriverResponse>> getDriversByVehicleId(@PathVariable Integer vehicleId) {
        List<DriverResponse> response = driverService.getDriversByVehicleId(vehicleId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/license/expired")
    public ResponseEntity<List<DriverResponse>> getDriversWithExpiredLicense() {
        List<DriverResponse> response = driverService.getDriversWithExpiredLicense();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/license/expiring")
    public ResponseEntity<List<DriverResponse>> getDriversWithExpiringLicense(
            @RequestParam(defaultValue = "30") int daysThreshold) {
        List<DriverResponse> response = driverService.getDriversWithExpiringLicense(daysThreshold);
        return ResponseEntity.ok(response);
    }

    // ======================== STATUS & ASSIGNMENT ========================

    @PatchMapping("/{id}/block")
    public ResponseEntity<DriverResponse> blockDriver(@PathVariable Integer id,
            @Valid @RequestBody DriverBlockRequest request) {
        DriverResponse response = driverService.blockDriver(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/unblock")
    public ResponseEntity<DriverResponse> unblockDriver(@PathVariable Integer id) {
        DriverResponse response = driverService.unblockDriver(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<DriverResponse> verifyDriver(@PathVariable Integer id) {
        DriverResponse response = driverService.verifyDriver(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<DriverResponse> activateDriver(@PathVariable Integer id) {
        DriverResponse response = driverService.activateDriver(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<DriverResponse> deactivateDriver(@PathVariable Integer id) {
        DriverResponse response = driverService.deactivateDriver(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign-vehicle")
    public ResponseEntity<DriverResponse> assignVehicle(@PathVariable Integer id,
            @RequestParam Integer vehicleId) {
        DriverResponse response = driverService.assignVehicle(id, vehicleId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/unassign-vehicle")
    public ResponseEntity<DriverResponse> unassignVehicle(@PathVariable Integer id) {
        DriverResponse response = driverService.unassignVehicle(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<DriverResponse> updateLocation(@PathVariable Integer id,
            @RequestParam String location,
            @RequestParam(required = false) String latitude,
            @RequestParam(required = false) String longitude) {
        DriverResponse response = driverService.updateLocation(id, location, latitude, longitude);
        return ResponseEntity.ok(response);
    }

    // ======================== STATISTICS ========================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDriverStatistics() {
        Map<String, Long> stats = driverService.getDriverStatistics();
        return ResponseEntity.ok(stats);
    }
}