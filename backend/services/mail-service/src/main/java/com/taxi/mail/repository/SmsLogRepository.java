package com.taxi.mail.repository;

import com.taxi.mail.entity.SmsLog;
import com.taxi.mail.enums.SmsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SmsLogRepository extends JpaRepository<SmsLog, Long> {
    
    List<SmsLog> findByStatus(SmsStatus status);
    
    List<SmsLog> findByDriverId(Long driverId);
    
    List<SmsLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}