package com.taxi.mail.repository;

import com.taxi.mail.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByBookingId(Integer bookingId);

    List<Notification> findByEmailStatus(String status);
}
