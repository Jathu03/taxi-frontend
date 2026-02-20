package com.taxi.booking.repository;

import com.taxi.booking.entity.BookingStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for BookingStatusHistory entity
 */
@Repository
public interface BookingStatusHistoryRepository extends JpaRepository<BookingStatusHistory, Integer> {

    /**
     * Find status history for a specific booking
     */
    List<BookingStatusHistory> findByBookingIdOrderByCreatedAtDesc(Integer bookingId);

    /**
     * Find status history by new status
     */
    List<BookingStatusHistory> findByNewStatus(String newStatus);
}