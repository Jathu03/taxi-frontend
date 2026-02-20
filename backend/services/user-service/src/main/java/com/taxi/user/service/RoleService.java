package com.taxi.user.service;

import com.taxi.user.dto.response.RoleResponse;
import com.taxi.user.entity.Role;
import com.taxi.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Role operations
 * Handles business logic for role management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RoleService {

    private final RoleRepository roleRepository;

    /**
     * Get all active roles
     * Used for populating role selection in UI
     */
    public List<RoleResponse> getAllRoles() {
        log.debug("Fetching all roles");
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(this::convertToRoleResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get role by ID
     */
    public Role getRoleById(Integer id) {
        log.debug("Fetching role with id: {}", id);
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }

    /**
     * Convert Role entity to RoleResponse DTO
     */
    private RoleResponse convertToRoleResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .roleName(role.getRoleName())
                .description(role.getDescription())
                .isActive(role.getIsActive())
                .build();
    }
}