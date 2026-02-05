package com.taxi.user.controller;

import com.taxi.user.dto.response.RoleResponse;
import com.taxi.user.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for Role operations
 * Provides endpoints for role management
 */
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Slf4j
public class RoleController {

    private final RoleService roleService;

    /**
     * GET /api/roles
     * Get all roles for dropdown selection
     */
    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        log.info("GET /api/roles - Fetching all roles");
        List<RoleResponse> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
}