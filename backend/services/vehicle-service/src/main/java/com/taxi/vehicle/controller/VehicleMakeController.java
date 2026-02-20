package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.VehicleMakeCreateRequest;
import com.taxi.vehicle.dto.request.VehicleMakeUpdateRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.VehicleMakeResponse;
import com.taxi.vehicle.service.VehicleMakeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-makes")
@RequiredArgsConstructor
@Slf4j
public class VehicleMakeController {

    private final VehicleMakeService makeService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleMakeResponse>> createMake(
            @Valid @RequestBody VehicleMakeCreateRequest request) {
        log.info("REST request to create vehicle make: {}", request.getManufacturer());
        try {
            VehicleMakeResponse created = makeService.createMake(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(created, "Vehicle make created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleMakeResponse>> getMakeById(@PathVariable Integer id) {
        try {
            VehicleMakeResponse make = makeService.getMakeById(id);
            return ResponseEntity.ok(ApiResponse.success(make, "Vehicle make retrieved successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleMakeResponse>>> getAllMakes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VehicleMakeResponse> makePage;
        if (search != null && !search.trim().isEmpty()) {
            makePage = makeService.searchMakes(search.trim(), pageable);
        } else {
            makePage = makeService.getAllMakes(pageable);
        }

        return ResponseEntity.ok(ApiResponse.paginated(
                makePage.getContent(),
                "Vehicle makes retrieved successfully",
                makePage.getTotalElements(),
                makePage.getTotalPages(),
                makePage.getNumber()));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<VehicleMakeResponse>>> getAllMakesList() {
        List<VehicleMakeResponse> makes = makeService.getAllMakesList();
        return ResponseEntity.ok(ApiResponse.success(makes, "All vehicle makes retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleMakeResponse>> updateMake(
            @PathVariable Integer id,
            @Valid @RequestBody VehicleMakeUpdateRequest request) {
        try {
            VehicleMakeResponse updated = makeService.updateMake(id, request);
            return ResponseEntity.ok(ApiResponse.success(updated, "Vehicle make updated successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMake(@PathVariable Integer id) {
        try {
            makeService.deleteMake(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Vehicle make deleted successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
}