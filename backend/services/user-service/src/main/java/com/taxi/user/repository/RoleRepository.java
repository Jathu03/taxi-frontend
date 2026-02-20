package com.taxi.user.repository;

import com.taxi.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity
 * Provides database operations for roles
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    /**
     * Find role by role name
     */
    Optional<Role> findByRoleName(String roleName);

    /**
     * Check if role name exists
     */
    boolean existsByRoleName(String roleName);
}