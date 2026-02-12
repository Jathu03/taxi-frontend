package com.taxi.mail.repository;

import com.taxi.mail.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationTypeRepository extends JpaRepository<NotificationType, Integer> {
    Optional<NotificationType> findByTypeCode(String typeCode);

    boolean existsByTypeCode(String typeCode);

    List<NotificationType> findByIsActiveTrue();
}
