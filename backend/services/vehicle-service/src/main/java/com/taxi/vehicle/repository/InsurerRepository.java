package com.taxi.vehicle.repository;

import com.taxi.vehicle.entity.Insurer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InsurerRepository extends JpaRepository<Insurer, Integer> {
    List<Insurer> findByIsActiveTrue();

    boolean existsByInsurerName(String name);
}