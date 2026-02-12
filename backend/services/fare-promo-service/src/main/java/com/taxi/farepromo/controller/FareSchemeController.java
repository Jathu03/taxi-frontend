package com.taxi.farepromo.controller;

import com.taxi.farepromo.dto.request.FareSchemeCreateRequest;
import com.taxi.farepromo.dto.request.FareSchemeUpdateRequest;
import com.taxi.farepromo.dto.response.ApiResponse;
import com.taxi.farepromo.dto.response.FareSchemeResponse;
import com.taxi.farepromo.service.FareSchemeService;
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
@RequestMapping("/api/fare-schemes")
@RequiredArgsConstructor
@Slf4j
public class FareSchemeController {

    private final FareSchemeService fareSchemeService;

    @PostMapping
    public ResponseEntity<ApiResponse<FareSchemeResponse>> create(
            @Valid @RequestBody FareSchemeCreateRequest request) {
        try {
            FareSchemeResponse created = fareSchemeService.createFareScheme(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(created, "Fare scheme created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FareSchemeResponse>> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    fareSchemeService.getFareSchemeById(id), "Fare scheme retrieved"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    // This endpoint is critical — called by other services (booking, vehicle, etc.)
    @GetMapping("/code/{fareCode}")
    public ResponseEntity<ApiResponse<FareSchemeResponse>> getByCode(@PathVariable String fareCode) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    fareSchemeService.getFareSchemeByCode(fareCode), "Fare scheme retrieved"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FareSchemeResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<FareSchemeResponse> result = fareSchemeService.searchFareSchemes(search, status, pageable);

        return ResponseEntity.ok(ApiResponse.paginated(
                result.getContent(), "Fare schemes retrieved",
                result.getTotalElements(), result.getTotalPages(), result.getNumber()));
    }

    // Called by other services for dropdowns
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<FareSchemeResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(
                fareSchemeService.getActiveFareSchemes(), "Active fare schemes retrieved"));
    }

    // Called by other services to get fare schemes for a specific vehicle class
    @GetMapping("/by-vehicle-class/{vehicleClassId}")
    public ResponseEntity<ApiResponse<List<FareSchemeResponse>>> getByVehicleClass(
            @PathVariable Integer vehicleClassId) {
        return ResponseEntity.ok(ApiResponse.success(
                fareSchemeService.getFareSchemesByVehicleClass(vehicleClassId),
                "Fare schemes retrieved for vehicle class: " + vehicleClassId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FareSchemeResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody FareSchemeUpdateRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    fareSchemeService.updateFareScheme(id, request), "Fare scheme updated"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            fareSchemeService.deleteFareScheme(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Fare scheme deleted"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<FareSchemeResponse>> toggleStatus(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    fareSchemeService.toggleFareSchemeStatus(id), "Fare scheme status toggled"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
}