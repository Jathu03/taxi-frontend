package com.taxi.corporate.repository;

import com.taxi.corporate.entity.CorporateVehicleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorporateVehicleCategoryRepository extends JpaRepository<CorporateVehicleCategory, Integer> {

    List<CorporateVehicleCategory> findByCorporateId(Integer corporateId);

    boolean existsByCorporateIdAndVehicleCategoryId(Integer corporateId, Integer vehicleCategoryId);

    @Modifying
    @Query("DELETE FROM CorporateVehicleCategory cvcat WHERE cvcat.corporate.id = :corporateId")
    void deleteByCorporateId(@Param("corporateId") Integer corporateId);
}