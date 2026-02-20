package com.taxi.corporate.controller;

import com.taxi.corporate.dto.request.AssignCorporateUserRequest;
import com.taxi.corporate.dto.request.CreateCorporateRequest;
import com.taxi.corporate.dto.request.UpdateCorporateRequest;
import com.taxi.corporate.dto.request.UpdateCorporateUserRequest;
import com.taxi.corporate.dto.response.CorporateResponse;
import com.taxi.corporate.dto.response.CorporateUserResponse;
import com.taxi.corporate.dto.response.CorporateVehicleClassResponse;
import com.taxi.corporate.dto.response.UserResponse;
import com.taxi.corporate.service.CorporateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corporates")
@RequiredArgsConstructor
public class CorporateController {

    private final CorporateService corporateService;

    // ==================== CORPORATE CRUD ====================

    @PostMapping
    public ResponseEntity<CorporateResponse> createCorporate(
            @RequestBody CreateCorporateRequest request) {
        return ResponseEntity.ok(corporateService.createCorporate(request));
    }

    @GetMapping
    public ResponseEntity<List<CorporateResponse>> getAllCorporates() {
        return ResponseEntity.ok(corporateService.getAllCorporates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CorporateResponse> getCorporateById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(corporateService.getCorporateById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CorporateResponse>> searchCorporates(
            @RequestParam String term) {
        return ResponseEntity.ok(corporateService.searchCorporates(term));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CorporateResponse> updateCorporate(
            @PathVariable Integer id,
            @RequestBody UpdateCorporateRequest request) {
        return ResponseEntity.ok(corporateService.updateCorporate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCorporate(@PathVariable Integer id) {
        corporateService.deleteCorporate(id);
        return ResponseEntity.ok().build();
    }

    // ==================== CORPORATE USERS ====================

    @GetMapping("/users/available")
    public ResponseEntity<List<UserResponse>> getCorporateRoleUsers() {
        return ResponseEntity.ok(corporateService.getCorporateRoleUsers());
    }

    @GetMapping("/{corporateId}/users")
    public ResponseEntity<List<CorporateUserResponse>> getCorporateUsers(
            @PathVariable Integer corporateId) {
        return ResponseEntity.ok(corporateService.getCorporateUsers(corporateId));
    }

    @GetMapping("/{corporateId}/users/{userId}")
    public ResponseEntity<CorporateUserResponse> getSingleCorporateUser(
            @PathVariable Integer corporateId,
            @PathVariable Integer userId) {
        return ResponseEntity.ok(
                corporateService.getSingleCorporateUser(corporateId, userId));
    }

    @PostMapping("/{corporateId}/users")
    public ResponseEntity<CorporateUserResponse> assignUserToCorporate(
            @PathVariable Integer corporateId,
            @RequestBody AssignCorporateUserRequest request) {
        return ResponseEntity.ok(
                corporateService.assignUserToCorporate(corporateId, request));
    }

    @PutMapping("/{corporateId}/users/{userId}")
    public ResponseEntity<CorporateUserResponse> updateCorporateUser(
            @PathVariable Integer corporateId,
            @PathVariable Integer userId,
            @RequestBody UpdateCorporateUserRequest request) {
        return ResponseEntity.ok(
                corporateService.updateCorporateUser(corporateId, userId, request));
    }

    @PatchMapping("/{corporateId}/users/{userId}/toggle")
    public ResponseEntity<CorporateUserResponse> toggleCorporateUser(
            @PathVariable Integer corporateId,
            @PathVariable Integer userId) {
        return ResponseEntity.ok(
                corporateService.toggleCorporateUser(corporateId, userId));
    }

    @DeleteMapping("/{corporateId}/users/{userId}")
    public ResponseEntity<Void> removeUserFromCorporate(
            @PathVariable Integer corporateId,
            @PathVariable Integer userId) {
        corporateService.removeUserFromCorporate(corporateId, userId);
        return ResponseEntity.ok().build();
    }

    // ==================== CORPORATE VEHICLE CLASSES ====================

    /**
     * Toggle enable/disable on a specific corporate-vehicle-class mapping.
     * Frontend calls:
     * PATCH /api/corporates/{corporateId}/vehicle-classes/{mappingId}/toggle
     */

    @PatchMapping("/{corporateId}/vehicle-classes/{classId}/toggle")
    public ResponseEntity<CorporateVehicleClassResponse> toggleVehicleClass(
            @PathVariable Integer corporateId,
            @PathVariable Integer classId) {

        return ResponseEntity.ok(
                corporateService.toggleVehicleClassForCorporate(corporateId, classId));
    }

}