package com.taxi.driver.controller;

import com.taxi.driver.dto.request.CreateDriverRequest;
import com.taxi.driver.dto.request.UpdateDriverRequest;
import com.taxi.driver.dto.response.DriverResponse;
import com.taxi.driver.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Driver operations
 * Provides endpoints for driver management (CRUD operations)
 * UI Endpoints: /admin/drivers/add, /admin/drivers/manage
 */
@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@Slf4j
public class DriverController {

    private final DriverService driverService;

    /**
     * POST /api/drivers
     * Create a new driver
     * Used by: /admin/drivers/add
     */
    @PostMapping
    public ResponseEntity<DriverResponse> createDriver(@Valid @RequestBody CreateDriverRequest request) {
        log.info("POST /api/drivers - Creating new driver: {}", request.getCode());
        DriverResponse response = driverService.createDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/drivers
     * Get all drivers or search/filter drivers
     * Used by: /admin/drivers/manage and other services
     * Query params:
     * - filterType: firstName|code|contactNumber
     * - searchTerm: search string
     * - activeOnly: true|false (for getting only active drivers)
     */
    @GetMapping
    public ResponseEntity<List<DriverResponse>> getDrivers(
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false, defaultValue = "false") Boolean activeOnly) {

        log.info("GET /api/drivers - filterType: {}, searchTerm: {}, activeOnly: {}",
                filterType, searchTerm, activeOnly);

        List<DriverResponse> drivers;

        if (activeOnly) {
            // Get only active drivers (for booking service, etc.)
            drivers = driverService.getActiveDrivers();
        } else if (searchTerm != null && !searchTerm.trim().isEmpty() && filterType != null) {
            // Search drivers by filter
            drivers = driverService.searchDrivers(filterType, searchTerm);
        } else {
            // Get all drivers
            drivers = driverService.getAllDrivers();
        }

        return ResponseEntity.ok(drivers);
    }

    /**
     * GET /api/drivers/{id}
     * Get driver by ID
     * Used by: /admin/drivers/edit/{id} and other services (Booking Service)
     */
    @GetMapping("/{id}")
    public ResponseEntity<DriverResponse> getDriverById(@PathVariable Integer id) {
        log.info("GET /api/drivers/{} - Fetching driver", id);
        DriverResponse driver = driverService.getDriverById(id);
        return ResponseEntity.ok(driver);
    }

    /**
     * GET /api/drivers/code/{code}
     * Get driver by code
     * Used by: Other services that need to lookup driver by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<DriverResponse> getDriverByCode(@PathVariable String code) {
        log.info("GET /api/drivers/code/{} - Fetching driver by code", code);
        DriverResponse driver = driverService.getDriverByCode(code);
        return ResponseEntity.ok(driver);
    }

    /**
     * GET /api/drivers/company/{companyId}
     * Get drivers by company ID
     * Used by: Admin filtering drivers by company
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<DriverResponse>> getDriversByCompany(@PathVariable Integer companyId) {
        log.info("GET /api/drivers/company/{} - Fetching drivers by company", companyId);
        List<DriverResponse> drivers = driverService.getDriversByCompany(companyId);
        return ResponseEntity.ok(drivers);
    }

    /**
     * PUT /api/drivers/{id}
     * Update driver
     * Used by: /admin/drivers/edit/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<DriverResponse> updateDriver(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateDriverRequest request) {

        log.info("PUT /api/drivers/{} - Updating driver", id);
        DriverResponse response = driverService.updateDriver(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/drivers/{id}
     * Delete driver
     * Used by: /admin/drivers/delete/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Integer id) {
        log.info("DELETE /api/drivers/{} - Deleting driver", id);
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }
}