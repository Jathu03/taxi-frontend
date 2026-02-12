package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.VehicleClassResponse;
import com.taxi.vehicle.dto.request.VehicleClassRequest;
import com.taxi.vehicle.service.VehicleClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-classes")
@RequiredArgsConstructor
public class VehicleClassController {

    private final VehicleClassService service;

    // Endpoint for Admin Table
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleClassResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(
                service.getAllClasses(), "Fetched all classes"));
    }

    // Endpoint for Dropdowns (Promo/Fare/Vehicle Owner UI)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VehicleClassResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(
                service.getAllActiveClasses(), "Fetched active classes"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleClassResponse>> create(@RequestBody VehicleClassRequest request) {
        return ResponseEntity.ok(ApiResponse.created(
                service.createClass(request), "Created successfully"));
    }
}