package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.VehicleOwner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleOwnerRepository extends JpaRepository<VehicleOwner, Integer> {

    List<VehicleOwner> findByIsActiveTrue();

    List<VehicleOwner> findByPrimaryContact(String primaryContact);

    // Search without status filter
    @Query("SELECT vo FROM VehicleOwner vo WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(vo.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(vo.nicOrBusinessReg) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(vo.company) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(vo.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "vo.primaryContact LIKE CONCAT('%', :search, '%'))")
    Page<VehicleOwner> searchOwners(@Param("search") String search, Pageable pageable);

    // Search with status filter
    @Query("SELECT vo FROM VehicleOwner vo WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(vo.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(vo.nicOrBusinessReg) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(vo.company) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(vo.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "vo.primaryContact LIKE CONCAT('%', :search, '%')) " +
            "AND (:isActive IS NULL OR vo.isActive = :isActive)")
    Page<VehicleOwner> searchOwnersWithFilter(@Param("search") String search,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
}