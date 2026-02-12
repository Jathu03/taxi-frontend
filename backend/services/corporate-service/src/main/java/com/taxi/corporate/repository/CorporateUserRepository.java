package com.taxi.corporate.repository;

import com.taxi.corporate.entity.CorporateUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CorporateUserRepository extends JpaRepository<CorporateUser, Integer> {

    List<CorporateUser> findByCorporateId(Integer corporateId);

    Optional<CorporateUser> findByCorporateIdAndUserId(Integer corporateId, Integer userId);

    boolean existsByCorporateIdAndUserId(Integer corporateId, Integer userId);

    @Modifying
    @Query("DELETE FROM CorporateUser cu WHERE cu.corporate.id = :corporateId")
    void deleteByCorporateId(@Param("corporateId") Integer corporateId);
}