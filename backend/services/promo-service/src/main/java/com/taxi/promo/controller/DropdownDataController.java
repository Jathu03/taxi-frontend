package com.taxi.promo.controller;

import com.taxi.promo.client.CorporateServiceClient;
import com.taxi.promo.client.VehicleServiceClient;
import com.taxi.promo.dto.response.CorporateResponse;
import com.taxi.promo.dto.response.VehicleClassResponse;
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
 * Used by: Promo code add/edit forms
 */
@RestController
@RequestMapping("/api/dropdown")
@RequiredArgsConstructor
@Slf4j
public class DropdownDataController {

    private final VehicleServiceClient vehicleServiceClient;
    private final CorporateServiceClient corporateServiceClient;

    /**
     * GET /api/dropdown/vehicle-classes
     * Get all vehicle classes for dropdown selection
     * Used by: Promo code add/edit forms (Vehicle Class dropdown)
     */
    @GetMapping("/vehicle-classes")
    public ResponseEntity<List<VehicleClassResponse>> getAllVehicleClasses() {
        log.info("GET /api/dropdown/vehicle-classes - Fetching all vehicle classes");
        List<VehicleClassResponse> vehicleClasses = vehicleServiceClient.getAllVehicleClasses();
        return ResponseEntity.ok(vehicleClasses);
    }

    /**
     * GET /api/dropdown/corporates
     * Get all corporates for dropdown selection
     * Used by: Promo code add/edit forms (Corporate dropdown)
     */
    @GetMapping("/corporates")
    public ResponseEntity<List<CorporateResponse>> getAllCorporates() {
        log.info("GET /api/dropdown/corporates - Fetching all corporates");
        List<CorporateResponse> corporates = corporateServiceClient.getAllCorporates();
        return ResponseEntity.ok(corporates);
    }
}