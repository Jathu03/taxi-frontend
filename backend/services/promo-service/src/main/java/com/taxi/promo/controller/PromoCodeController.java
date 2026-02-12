package com.taxi.promo.controller;

import com.taxi.promo.dto.request.CreatePromoCodeRequest;
import com.taxi.promo.dto.request.UpdatePromoCodeRequest;
import com.taxi.promo.dto.response.PromoCodeResponse;
import com.taxi.promo.service.PromoCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Promo Code operations
 * Provides endpoints for promo code management
 * UI Endpoint: /admin/promo-codes/manage
 */
@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
@Slf4j
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    /**
     * POST /api/promo-codes
     * Create a new promo code
     * Used by: /admin/promo-codes/add
     */
    @PostMapping
    public ResponseEntity<PromoCodeResponse> createPromoCode(@Valid @RequestBody CreatePromoCodeRequest request) {
        log.info("POST /api/promo-codes - Creating new promo code: {}", request.getCode());
        PromoCodeResponse response = promoCodeService.createPromoCode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/promo-codes
     * Get all promo codes or search by filter
     * Used by: /admin/promo-codes/manage
     * Query params:
     * - filterType: code|description|class
     * - searchTerm: search string
     * - activeOnly: true|false (for getting only active promo codes)
     */
    @GetMapping
    public ResponseEntity<List<PromoCodeResponse>> getPromoCodes(
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false, defaultValue = "false") Boolean activeOnly) {

        log.info("GET /api/promo-codes - filterType: {}, searchTerm: {}, activeOnly: {}",
                filterType, searchTerm, activeOnly);

        List<PromoCodeResponse> promoCodes;

        if (activeOnly) {
            // Get only active promo codes (for booking service, etc.)
            promoCodes = promoCodeService.getActivePromoCodes();
        } else if (searchTerm != null && !searchTerm.trim().isEmpty() && filterType != null) {
            // Search promo codes by filter
            promoCodes = promoCodeService.searchPromoCodes(filterType, searchTerm);
        } else {
            // Get all promo codes
            promoCodes = promoCodeService.getAllPromoCodes();
        }

        return ResponseEntity.ok(promoCodes);
    }

    /**
     * GET /api/promo-codes/{id}
     * Get promo code by ID
     * Used by: /admin/promo-codes/edit/{id} and other services
     */
    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeById(@PathVariable Integer id) {
        log.info("GET /api/promo-codes/{} - Fetching promo code", id);
        PromoCodeResponse promoCode = promoCodeService.getPromoCodeById(id);
        return ResponseEntity.ok(promoCode);
    }

    /**
     * GET /api/promo-codes/code/{code}
     * Get promo code by code
     * Used by: Booking Service to validate and apply promo code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeByCode(@PathVariable String code) {
        log.info("GET /api/promo-codes/code/{} - Fetching promo code by code", code);
        PromoCodeResponse promoCode = promoCodeService.getPromoCodeByCode(code);
        return ResponseEntity.ok(promoCode);
    }

    /**
     * PUT /api/promo-codes/{id}
     * Update promo code
     * Used by: /admin/promo-codes/edit/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PromoCodeResponse> updatePromoCode(
            @PathVariable Integer id,
            @Valid @RequestBody UpdatePromoCodeRequest request) {

        log.info("PUT /api/promo-codes/{} - Updating promo code", id);
        PromoCodeResponse response = promoCodeService.updatePromoCode(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/promo-codes/{id}
     * Delete promo code
     * Used by: /admin/promo-codes/delete/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Integer id) {
        log.info("DELETE /api/promo-codes/{} - Deleting promo code", id);
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }
}