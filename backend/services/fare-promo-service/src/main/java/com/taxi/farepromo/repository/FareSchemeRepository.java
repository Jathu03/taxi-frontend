package com.taxi.farepromo.repository;

import com.taxi.farepromo.entity.FareScheme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FareSchemeRepository extends JpaRepository<FareScheme, Integer> {

        Optional<FareScheme> findByFareCode(String fareCode);

        boolean existsByFareCode(String fareCode);

        List<FareScheme> findByStatus(String status);

        List<FareScheme> findByVehicleClassId(Integer vehicleClassId);

        @Query("SELECT f FROM FareScheme f WHERE " +
                        "(:search IS NULL OR :search = '' OR " +
                        "LOWER(f.fareCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(f.fareName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<FareScheme> searchFareSchemes(@Param("search") String search, Pageable pageable);

        @Query("SELECT f FROM FareScheme f WHERE " +
                        "(:search IS NULL OR :search = '' OR " +
                        "LOWER(f.fareCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(f.fareName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
                        "AND (:status IS NULL OR f.status = :status)")
        Page<FareScheme> searchFareSchemesWithFilter(@Param("search") String search,
                        @Param("status") String status,
                        Pageable pageable);

        @Query("SELECT f FROM FareScheme f WHERE " +
                        "f.vehicleClassId = :vehicleClassId AND f.status = 'Active'")
        List<FareScheme> findActiveFareSchemesByVehicleClass(@Param("vehicleClassId") Integer vehicleClassId);
}