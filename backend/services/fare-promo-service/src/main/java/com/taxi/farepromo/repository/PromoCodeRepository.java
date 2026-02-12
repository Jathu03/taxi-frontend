package com.taxi.farepromo.repository;

import com.taxi.farepromo.entity.PromoCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Integer> {

        Optional<PromoCode> findByCode(String code);

        boolean existsByCode(String code);

        List<PromoCode> findByIsActiveTrue();

        List<PromoCode> findByCorporateId(Integer corporateId);

        @Query("SELECT p FROM PromoCode p WHERE " +
                        "p.isActive = true AND " +
                        "p.startDate <= :now AND p.endDate >= :now AND " +
                        "(p.maxUsage = 0 OR p.currentUsage < p.maxUsage)")
        List<PromoCode> findCurrentlyValidPromos(@Param("now") LocalDateTime now);

        @Query("SELECT p FROM PromoCode p WHERE " +
                        "(:search IS NULL OR :search = '' OR " +
                        "LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<PromoCode> searchPromoCodes(@Param("search") String search, Pageable pageable);

        @Query("SELECT p FROM PromoCode p WHERE " +
                        "(:search IS NULL OR :search = '' OR " +
                        "LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
                        "AND (:isActive IS NULL OR p.isActive = :isActive)")
        Page<PromoCode> searchPromoCodesWithFilter(@Param("search") String search,
                        @Param("isActive") Boolean isActive,
                        Pageable pageable);
}