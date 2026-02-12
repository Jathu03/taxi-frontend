package com.taxi.corporate.repository;

import com.taxi.corporate.entity.Corporate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorporateRepository extends JpaRepository<Corporate, Integer> {

    boolean existsByCode(String code);

    boolean existsByEmail(String email);

    @Query("SELECT c FROM Corporate c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(c.code) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "c.phone LIKE CONCAT('%', :term, '%')")
    List<Corporate> searchCorporates(@Param("term") String searchTerm);
}