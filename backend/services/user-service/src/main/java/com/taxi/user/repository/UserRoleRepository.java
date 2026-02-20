package com.taxi.user.repository;

import com.taxi.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository interface for UserRole entity
 * Provides database operations for user-role relationships
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    List<UserRole> findByUserId(Integer userId);

    @Modifying
    @Query("DELETE FROM UserRole ur WHERE ur.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);
}