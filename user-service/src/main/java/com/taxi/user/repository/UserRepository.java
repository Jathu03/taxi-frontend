package com.taxi.user.repository;

import com.taxi.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 * Provides database operations for users
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

        /**
         * Find user by username
         */
        Optional<User> findByUsername(String username);

        /**
         * Find user by email
         */
        Optional<User> findByEmail(String email);

        /**
         * Find user by phone number
         */
        Optional<User> findByPhoneNumber(String phoneNumber);

        /**
         * Check if username already exists
         */
        boolean existsByUsername(String username);

        /**
         * Check if email already exists
         */
        boolean existsByEmail(String email);

        /**
         * Check if phone number already exists
         */
        boolean existsByPhoneNumber(String phoneNumber);

        /**
         * Search users by phone number containing the search term
         */
        List<User> findByPhoneNumberContaining(String phoneNumber);

        /**
         * Search users by any field (username, email, first name, last name, phone)
         */
        @Query("SELECT u FROM User u WHERE " +
                        "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "u.phoneNumber LIKE CONCAT('%', :searchTerm, '%')")
        List<User> searchUsers(@Param("searchTerm") String searchTerm);
}