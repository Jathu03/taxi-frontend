package com.taxi.promo.repository;

import com.taxi.promo.entity.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for PromoCode entity
 * Provides database operations for promo codes
 */
@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Integer> {

        /**
         * Find promo code by code
         */
        Optional<PromoCode> findByCode(String code);

        /**
         * Check if promo code exists
         */
        boolean existsByCode(String code);

        /**
         * Find all active promo codes
         */
        List<PromoCode> findByIsActiveTrue();

        /**
         * Search promo codes by code
         */
        @Query("SELECT p FROM PromoCode p WHERE " +
                        "LOWER(p.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
        List<PromoCode> searchByCode(@Param("searchTerm") String searchTerm);

        /**
         * Search promo codes by description
         */
        @Query("SELECT p FROM PromoCode p WHERE " +
                        "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
        List<PromoCode> searchByDescription(@Param("searchTerm") String searchTerm);

        /**
         * Search promo codes by code or description
         */
        @Query("SELECT p FROM PromoCode p WHERE " +
                        "LOWER(p.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
        List<PromoCode> searchPromoCodes(@Param("searchTerm") String searchTerm);
}