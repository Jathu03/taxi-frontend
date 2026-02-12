package com.taxi.farepromo.controller;

import com.taxi.farepromo.dto.request.PromoCodeCreateRequest;
import com.taxi.farepromo.dto.request.PromoCodeUpdateRequest;
import com.taxi.farepromo.dto.request.PromoCodeUsageRequest;
import com.taxi.farepromo.dto.response.ApiResponse;
import com.taxi.farepromo.dto.response.PromoCodeResponse;
import com.taxi.farepromo.dto.response.PromoCodeUsageResponse;
import com.taxi.farepromo.service.PromoCodeService;
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
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
@Slf4j
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    @PostMapping
    public ResponseEntity<ApiResponse<PromoCodeResponse>> create(
            @Valid @RequestBody PromoCodeCreateRequest request) {
        try {
            PromoCodeResponse created = promoCodeService.createPromoCode(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(created, "Promo code created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), 409));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PromoCodeResponse>> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    promoCodeService.getPromoCodeById(id), "Promo code retrieved"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<PromoCodeResponse>> getByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    promoCodeService.getPromoCodeByCode(code), "Promo code retrieved"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromoCodeResponse>>> getAll(
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

        Page<PromoCodeResponse> result = promoCodeService.searchPromoCodes(search, isActive, pageable);

        return ResponseEntity.ok(ApiResponse.paginated(
                result.getContent(), "Promo codes retrieved",
                result.getTotalElements(), result.getTotalPages(), result.getNumber()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PromoCodeResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(
                promoCodeService.getActivePromoCodes(), "Active promo codes retrieved"));
    }

    @GetMapping("/valid")
    public ResponseEntity<ApiResponse<List<PromoCodeResponse>>> getValid() {
        return ResponseEntity.ok(ApiResponse.success(
                promoCodeService.getValidPromoCodes(), "Valid promo codes retrieved"));
    }

    // Validation endpoint — called by booking service
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<PromoCodeResponse>> validate(
            @RequestParam String code,
            @RequestParam(required = false) String contactNumber,
            @RequestParam(required = false) Integer vehicleClassId) {
        try {
            PromoCodeResponse result = promoCodeService.validatePromoCode(code, contactNumber, vehicleClassId);
            return ResponseEntity.ok(ApiResponse.success(result, "Promo code is valid"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PromoCodeResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody PromoCodeUpdateRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    promoCodeService.updatePromoCode(id, request), "Promo code updated"));
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
            promoCodeService.deletePromoCode(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Promo code deleted"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<PromoCodeResponse>> toggleStatus(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    promoCodeService.togglePromoCodeStatus(id), "Promo code status toggled"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }

    // ========== Usage Endpoints ==========

    @PostMapping("/usage")
    public ResponseEntity<ApiResponse<PromoCodeUsageResponse>> recordUsage(
            @Valid @RequestBody PromoCodeUsageRequest request) {
        try {
            PromoCodeUsageResponse usage = promoCodeService.recordUsage(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.created(usage, "Promo code usage recorded"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }

    @GetMapping("/{promoCodeId}/usage")
    public ResponseEntity<ApiResponse<List<PromoCodeUsageResponse>>> getUsage(
            @PathVariable Integer promoCodeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("usedAt").descending());
            Page<PromoCodeUsageResponse> result = promoCodeService.getUsageByPromoCode(promoCodeId, pageable);
            return ResponseEntity.ok(ApiResponse.paginated(
                    result.getContent(), "Promo code usage retrieved",
                    result.getTotalElements(), result.getTotalPages(), result.getNumber()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), 404));
        }
    }
}