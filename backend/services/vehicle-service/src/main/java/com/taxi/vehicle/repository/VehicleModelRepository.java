package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.VehicleModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Integer> {

    List<VehicleModel> findByMakeId(Integer makeId);

    Page<VehicleModel> findByMakeId(Integer makeId, Pageable pageable);

    boolean existsByModelAndMakeId(String model, Integer makeId);

    @Query("SELECT m FROM VehicleModel m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(m.model) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.modelCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.make.manufacturer) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VehicleModel> searchModels(@Param("search") String search, Pageable pageable);

    @Query("SELECT m FROM VehicleModel m WHERE " +
            "m.make.id = :makeId AND " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(m.model) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.modelCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VehicleModel> searchModelsByMake(@Param("makeId") Integer makeId,
            @Param("search") String search,
            Pageable pageable);
}