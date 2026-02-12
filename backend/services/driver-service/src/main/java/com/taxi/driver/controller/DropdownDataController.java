package com.taxi.driver.controller;

import com.taxi.driver.client.UserServiceClient;
import com.taxi.driver.client.VehicleServiceClient;
import com.taxi.driver.dto.response.CompanyResponse;
import com.taxi.driver.dto.response.UserResponse;
import com.taxi.driver.dto.response.VehicleResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for dropdown data from other services
 * Provides endpoints for fetching dropdown options
 * Used by: Driver add/edit forms
 */
@RestController
@RequestMapping("/api/dropdown")
@RequiredArgsConstructor
@Slf4j
public class DropdownDataController {

    private final UserServiceClient userServiceClient;
    private final VehicleServiceClient vehicleServiceClient;

    /**
     * GET /api/dropdown/users
     * Get all users for dropdown selection
     * Used by: Driver add/edit forms (User dropdown)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("GET /api/dropdown/users - Fetching all users");
        List<UserResponse> users = userServiceClient.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/dropdown/vehicles
     * Get all vehicles for dropdown selection
     * Used by: Driver add/edit forms (Vehicle dropdown)
     */
    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        log.info("GET /api/dropdown/vehicles - Fetching all vehicles");
        List<VehicleResponse> vehicles = vehicleServiceClient.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    /**
     * GET /api/dropdown/companies
     * Get all companies for dropdown selection
     * Used by: Driver add/edit forms (Company dropdown)
     */
    @GetMapping("/companies")
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        log.info("GET /api/dropdown/companies - Fetching all companies");
        List<CompanyResponse> companies = vehicleServiceClient.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
}