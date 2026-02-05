package com.taxi.user.repository;

import com.taxi.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for UserRole entity
 * Provides database operations for user-role relationships
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    /**
     * Delete all roles for a specific user
     */
    void deleteByUserId(Integer userId);

    /**
     * Find all user-role mappings for a specific user
     */
    List<UserRole> findByUserId(Integer userId);
}