package com.taxi.booking.repository;

import com.taxi.booking.entity.BookingCancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for BookingCancellation entity
 */
@Repository
public interface BookingCancellationRepository extends JpaRepository<BookingCancellation, Integer> {

    /**
     * Find cancellation by booking ID
     */
    Optional<BookingCancellation> findByBookingId(Integer bookingId);

    /**
     * Find cancellations by cancelled type
     */
    List<BookingCancellation> findByCancelledType(String cancelledType);

    /**
     * Find cancellations by date range
     */
    @Query("SELECT bc FROM BookingCancellation bc WHERE " +
            "bc.cancelledTime BETWEEN :startDate AND :endDate " +
            "ORDER BY bc.cancelledTime DESC")
    List<BookingCancellation> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Find cancellations by user
     */
    List<BookingCancellation> findByCancelledByUserId(Integer userId);

    /**
     * Find cancellations by driver
     */
    List<BookingCancellation> findByCancelledByDriverId(Integer driverId);
}