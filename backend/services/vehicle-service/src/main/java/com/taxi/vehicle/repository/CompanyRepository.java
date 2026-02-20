package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {

    Optional<Company> findByCompanyCode(String companyCode);

    boolean existsByCompanyCode(String companyCode);

    boolean existsByCompanyName(String companyName);

    List<Company> findByIsActiveTrue();

    // Search without status filter
    @Query("SELECT c FROM Company c WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.companyCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Company> searchCompanies(@Param("search") String search, Pageable pageable);

    // Search with status filter
    @Query("SELECT c FROM Company c WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.companyCode) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:isActive IS NULL OR c.isActive = :isActive)")
    Page<Company> searchCompaniesWithFilter(@Param("search") String search,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
}