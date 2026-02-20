package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.VehicleCreateRequest;
import com.taxi.vehicle.dto.request.VehicleUpdateRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.VehicleResponse;
import com.taxi.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;

// Import necessary classes
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> create(@RequestBody VehicleCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.created(
                vehicleService.createVehicle(request), "Vehicle created"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(
                vehicleService.getVehicleById(id), "Vehicle fetched"));
    }

    // --- CORRECTED GET ALL METHOD ---
    @GetMapping
    // The signature now correctly states the 'data' field will be a List
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getAll(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive) {

        Page<VehicleResponse> pageResult = vehicleService.searchVehicles(search, isActive, pageable);

        // This call will now compile without any errors
        return ResponseEntity.ok(ApiResponse.paginated(
                pageResult.getContent(), // This is a List
                "Vehicles fetched successfully",
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> update(@PathVariable Integer id,
            @RequestBody VehicleUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                vehicleService.updateVehicle(id, request), "Vehicle updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Vehicle deleted"));
    }
}