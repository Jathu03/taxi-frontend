package com.taxi.booking.repository;

import java.math.BigDecimal;
import com.taxi.booking.entity.Booking;
import com.taxi.booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Booking entity
 * Provides database operations for bookings
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

        /**
         * Find booking by booking ID
         */
        Optional<Booking> findByBookingId(String bookingId);

        /**
         * Find bookings by status
         */
        List<Booking> findByStatus(BookingStatus status);

        /**
         * Find bookings by status and excluding test bookings
         */
        List<Booking> findByStatusAndIsTestBookingFalse(BookingStatus status);

        /**
         * Find inquiry bookings
         */
        List<Booking> findByIsInquiryOnlyTrue();

        /**
         * Find advance bookings
         */
        List<Booking> findByIsAdvanceBookingTrueAndStatusIn(List<BookingStatus> statuses);

        /**
         * Find bookings by driver ID
         */
        List<Booking> findByDriverId(Integer driverId);

        /**
         * Find bookings by vehicle ID
         */
        List<Booking> findByVehicleId(Integer vehicleId);

        /**
         * Find bookings by corporate ID
         */
        List<Booking> findByCorporateId(Integer corporateId);

        /**
         * Search bookings by customer name
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "LOWER(b.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
        List<Booking> searchByCustomerName(@Param("searchTerm") String searchTerm);

        /**
         * Search bookings by phone number
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "b.contactNumber LIKE CONCAT('%', :phone, '%')")
        List<Booking> searchByPhone(@Param("phone") String phone);

        /**
         * Search bookings by booking ID
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "LOWER(b.bookingId) LIKE LOWER(CONCAT('%', :bookingId, '%'))")
        List<Booking> searchByBookingId(@Param("bookingId") String bookingId);

        /**
         * Find bookings by date range
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "b.bookingTime BETWEEN :startDate AND :endDate " +
                        "ORDER BY b.bookingTime DESC")
        List<Booking> findByBookingTimeBetween(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Find completed bookings by date range
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "b.status = 'COMPLETED' AND " +
                        "b.completedTime BETWEEN :startDate AND :endDate " +
                        "ORDER BY b.completedTime DESC")
        List<Booking> findCompletedBookingsByDateRange(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Find cancelled bookings by date range
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "b.status = 'CANCELLED' AND " +
                        "b.updatedAt BETWEEN :startDate AND :endDate " +
                        "ORDER BY b.updatedAt DESC")
        List<Booking> findCancelledBookingsByDateRange(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Advanced search with multiple filters
         */
        @Query("SELECT b FROM Booking b WHERE " +
                        "(:status IS NULL OR b.status = :status) AND " +
                        "(:vehicleClassId IS NULL OR b.vehicleClassId = :vehicleClassId) AND " +
                        "(:corporateId IS NULL OR b.corporateId = :corporateId) AND " +
                        "(:driverId IS NULL OR b.driverId = :driverId) AND " +
                        "(:bookedBy IS NULL OR b.bookedBy = :bookedBy) AND " +
                        "(:hireType IS NULL OR b.hireType = :hireType) AND " +
                        "(:paymentType IS NULL OR b.paymentType = :paymentType) AND " +
                        "(:bookingSource IS NULL OR b.bookingSource = :bookingSource) AND " +
                        "b.bookingTime BETWEEN :startDate AND :endDate " +
                        "ORDER BY b.bookingTime DESC")
        List<Booking> advancedSearch(
                        @Param("status") BookingStatus status,
                        @Param("vehicleClassId") Integer vehicleClassId,
                        @Param("corporateId") Integer corporateId,
                        @Param("driverId") Integer driverId,
                        @Param("bookedBy") Integer bookedBy,
                        @Param("hireType") String hireType,
                        @Param("paymentType") String paymentType,
                        @Param("bookingSource") String bookingSource,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Calculate total fare for completed bookings (excluding test bookings)
         */
        @Query("SELECT SUM(b.totalFare) FROM Booking b WHERE " +
                        "b.status = 'COMPLETED' AND " +
                        "b.isTestBooking = false AND " +
                        "b.completedTime BETWEEN :startDate AND :endDate")
        BigDecimal calculateTotalFare(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Calculate total discount for completed bookings
         */
        @Query("SELECT SUM(b.discountAmount) FROM Booking b WHERE " +
                        "b.status = 'COMPLETED' AND " +
                        "b.isTestBooking = false AND " +
                        "b.completedTime BETWEEN :startDate AND :endDate")
        BigDecimal calculateTotalDiscount(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Count bookings by status
         */
        Long countByStatus(BookingStatus status);

        /**
         * Find TUK bookings (by vehicle class code)
         * Note: This requires joining with Vehicle Service data
         */
        @Query("SELECT b FROM Booking b WHERE b.vehicleClassId = :vehicleClassId")
        List<Booking> findByVehicleClassId(@Param("vehicleClassId") Integer vehicleClassId);
}