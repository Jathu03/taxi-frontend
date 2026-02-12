package com.taxi.corporate.repository;

import com.taxi.corporate.entity.CorporateVehicleClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorporateVehicleClassRepository extends JpaRepository<CorporateVehicleClass, Integer> {

    List<CorporateVehicleClass> findByCorporateId(Integer corporateId);

    boolean existsByCorporateIdAndVehicleClassId(Integer corporateId, Integer vehicleClassId);

    @Modifying
    @Query("DELETE FROM CorporateVehicleClass cvc WHERE cvc.corporate.id = :corporateId")
    void deleteByCorporateId(@Param("corporateId") Integer corporateId);
}