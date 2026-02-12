package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.CreateVehicleOwnerRequest;
import com.taxi.vehicle.dto.request.VehicleOwnerUpdateRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.VehicleOwnerResponse;
import com.taxi.vehicle.service.VehicleOwnerService;
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
@RequestMapping("/api/vehicle-owners")
@RequiredArgsConstructor
@Slf4j
public class VehicleOwnerController {

    private final VehicleOwnerService vehicleOwnerService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleOwnerResponse>> createOwner(
            @Valid @RequestBody CreateVehicleOwnerRequest request) {
        log.info("REST request to create vehicle owner: {}", request.getName());
        try {
            VehicleOwnerResponse created = vehicleOwnerService.createOwner(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(created, "Vehicle owner created successfully"));
        } catch (IllegalArgumentException e) {
            log.warn("Vehicle owner creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleOwnerResponse>> getOwnerById(@PathVariable Integer id) {
        log.debug("REST request to get vehicle owner by id: {}", id);
        try {
            VehicleOwnerResponse owner = vehicleOwnerService.getOwnerById(id);
            return ResponseEntity.ok(ApiResponse.success(owner,
                    "Vehicle owner retrieved successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleOwnerResponse>>> getAllOwners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VehicleOwnerResponse> ownerPage = vehicleOwnerService.searchOwners(search, isActive, pageable);

        return ResponseEntity.ok(ApiResponse.paginated(
                ownerPage.getContent(),
                "Vehicle owners retrieved successfully",
                ownerPage.getTotalElements(),
                ownerPage.getTotalPages(),
                ownerPage.getNumber()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VehicleOwnerResponse>>> getAllActiveOwners() {
        List<VehicleOwnerResponse> owners = vehicleOwnerService.getAllActiveOwners();
        return ResponseEntity.ok(ApiResponse.success(owners,
                "Active vehicle owners retrieved successfully"));
    }

    @GetMapping("/by-contact/{contact}")
    public ResponseEntity<ApiResponse<List<VehicleOwnerResponse>>> getOwnersByContact(
            @PathVariable String contact) {
        List<VehicleOwnerResponse> owners = vehicleOwnerService.getOwnersByContact(contact);
        return ResponseEntity.ok(ApiResponse.success(owners,
                "Vehicle owners retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleOwnerResponse>> updateOwner(
            @PathVariable Integer id,
            @Valid @RequestBody VehicleOwnerUpdateRequest request) {
        log.info("REST request to update vehicle owner with id: {}", id);
        try {
            VehicleOwnerResponse updated = vehicleOwnerService.updateOwner(id, request);
            return ResponseEntity.ok(ApiResponse.success(updated,
                    "Vehicle owner updated successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOwner(@PathVariable Integer id) {
        log.info("REST request to delete vehicle owner with id: {}", id);
        try {
            vehicleOwnerService.deleteOwner(id);
            return ResponseEntity.ok(ApiResponse.success(null,
                    "Vehicle owner deleted successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<VehicleOwnerResponse>> toggleOwnerStatus(
            @PathVariable Integer id) {
        try {
            VehicleOwnerResponse updated = vehicleOwnerService.toggleOwnerStatus(id);
            return ResponseEntity.ok(ApiResponse.success(updated,
                    "Vehicle owner status toggled successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
}