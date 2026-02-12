package com.taxi.vehicle.controller;

import com.taxi.vehicle.dto.request.VehicleModelCreateRequest;
import com.taxi.vehicle.dto.request.VehicleModelUpdateRequest;
import com.taxi.vehicle.dto.response.ApiResponse;
import com.taxi.vehicle.dto.response.VehicleModelResponse;
import com.taxi.vehicle.service.VehicleModelService;
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
@RequestMapping("/api/vehicle-models")
@RequiredArgsConstructor
@Slf4j
public class VehicleModelController {

    private final VehicleModelService modelService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleModelResponse>> createModel(
            @Valid @RequestBody VehicleModelCreateRequest request) {
        log.info("REST request to create vehicle model: {} for make: {}", request.getModel(), request.getMakeId());
        try {
            VehicleModelResponse created = modelService.createModel(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(created, "Vehicle model created successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleModelResponse>> getModelById(@PathVariable Integer id) {
        try {
            VehicleModelResponse model = modelService.getModelById(id);
            return ResponseEntity.ok(ApiResponse.success(model, "Vehicle model retrieved successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleModelResponse>>> getAllModels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VehicleModelResponse> modelPage;
        if (search != null && !search.trim().isEmpty()) {
            modelPage = modelService.searchModels(search.trim(), pageable);
        } else {
            modelPage = modelService.getAllModels(pageable);
        }

        return ResponseEntity.ok(ApiResponse.paginated(
                modelPage.getContent(),
                "Vehicle models retrieved successfully",
                modelPage.getTotalElements(),
                modelPage.getTotalPages(),
                modelPage.getNumber()));
    }

    @GetMapping("/by-make/{makeId}")
    public ResponseEntity<ApiResponse<List<VehicleModelResponse>>> getModelsByMake(
            @PathVariable Integer makeId) {
        try {
            List<VehicleModelResponse> models = modelService.getModelsByMakeId(makeId);
            return ResponseEntity.ok(ApiResponse.success(models,
                    "Vehicle models retrieved successfully for make ID: " + makeId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping("/by-make/{makeId}/search")
    public ResponseEntity<ApiResponse<List<VehicleModelResponse>>> searchModelsByMake(
            @PathVariable Integer makeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        try {
            Page<VehicleModelResponse> modelPage = modelService.searchModelsByMake(makeId, search, pageable);
            return ResponseEntity.ok(ApiResponse.paginated(
                    modelPage.getContent(),
                    "Vehicle models retrieved successfully",
                    modelPage.getTotalElements(),
                    modelPage.getTotalPages(),
                    modelPage.getNumber()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleModelResponse>> updateModel(
            @PathVariable Integer id,
            @Valid @RequestBody VehicleModelUpdateRequest request) {
        try {
            VehicleModelResponse updated = modelService.updateModel(id, request);
            return ResponseEntity.ok(ApiResponse.success(updated, "Vehicle model updated successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteModel(@PathVariable Integer id) {
        try {
            modelService.deleteModel(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Vehicle model deleted successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
}