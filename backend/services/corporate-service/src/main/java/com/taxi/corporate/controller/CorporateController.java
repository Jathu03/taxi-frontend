package com.taxi.corporate.controller;

import com.taxi.corporate.dto.request.*;
import com.taxi.corporate.dto.response.*;
import com.taxi.corporate.service.CorporateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corporates")
@RequiredArgsConstructor
@Slf4j
public class CorporateController {

    private final CorporateService corporateService;

    // ==================== CORPORATE CRUD ====================

    @PostMapping
    public ResponseEntity<CorporateResponse> create(@Valid @RequestBody CreateCorporateRequest request) {
        log.info("POST /api/corporates - Creating: {}", request.getCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(corporateService.createCorporate(request));
    }

    @GetMapping
    public ResponseEntity<List<CorporateResponse>> getAll(
            @RequestParam(required = false) String searchTerm) {
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return ResponseEntity.ok(corporateService.searchCorporates(searchTerm));
        }
        return ResponseEntity.ok(corporateService.getAllCorporates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CorporateResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(corporateService.getCorporateById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CorporateResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCorporateRequest request) {
        return ResponseEntity.ok(corporateService.updateCorporate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        corporateService.deleteCorporate(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CORPORATE USERS ====================

    /**
     * Get all users with "Corporate" role (available to assign)
     */
    @GetMapping("/users/available")
    public ResponseEntity<List<UserResponse>> getAvailableCorporateUsers() {
        return ResponseEntity.ok(corporateService.getCorporateRoleUsers());
    }

    /**
     * Get users assigned to a specific corporate
     */
    @GetMapping("/{id}/users")
    public ResponseEntity<List<CorporateUserResponse>> getCorporateUsers(@PathVariable Integer id) {
        return ResponseEntity.ok(corporateService.getCorporateUsers(id));
    }

    /**
     * Assign a user to a corporate
     */
    @PostMapping("/{id}/users")
    public ResponseEntity<CorporateUserResponse> assignUser(
            @PathVariable Integer id,
            @Valid @RequestBody AssignCorporateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(corporateService.assignUserToCorporate(id, request));
    }

    /**
     * Toggle user enable/disable in a corporate
     */
    @PutMapping("/{corporateId}/users/{userId}/toggle")
    public ResponseEntity<CorporateUserResponse> toggleUser(
            @PathVariable Integer corporateId,
            @PathVariable Integer userId) {
        return ResponseEntity.ok(corporateService.toggleCorporateUser(corporateId, userId));
    }

    /**
     * Remove user from a corporate
     */
    @DeleteMapping("/{corporateId}/users/{userId}")
    public ResponseEntity<Void> removeUser(
            @PathVariable Integer corporateId,
            @PathVariable Integer userId) {
        corporateService.removeUserFromCorporate(corporateId, userId);
        return ResponseEntity.noContent().build();
    }
}