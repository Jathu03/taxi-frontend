package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.VehicleClassRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.VehicleClassResponse;
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

    // Endpoint for Admin Table - load ALL classes
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleClassResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(
                service.getAllClasses(), "Fetched all classes"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleClassResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(
                service.getClassById(id), "Fetched successfully"));
    }

    // Endpoint for Dropdowns (Promo/Fare/Vehicle Owner UI)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VehicleClassResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(
                service.getAllActiveClasses(), "Fetched active classes"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        service.deleteClass(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleClassResponse>> update(
            @PathVariable Integer id,
            @RequestBody VehicleClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                service.updateClass(id, request), "Updated successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleClassResponse>> create(@RequestBody VehicleClassRequest request) {
        return ResponseEntity.ok(ApiResponse.created(
                service.createClass(request), "Created successfully"));
    }

    // ✅ NEW: Toggle active status (showInApp) of a Vehicle Class
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<VehicleClassResponse>> toggleActive(@PathVariable Integer id) {
        VehicleClassResponse updated = service.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success(
                updated, "Toggled active status"));
    }
}