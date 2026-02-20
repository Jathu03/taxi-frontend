package com.taxi.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a Booking Cancellation
 * Maps to 'booking_cancellations' table in database
 */
@Entity
@Table(name = "booking_cancellations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(name = "cancelled_time", nullable = false)
    private LocalDateTime cancelledTime = LocalDateTime.now();

    @Column(name = "cancelled_type", length = 50)
    private String cancelledType;

    @Column(name = "cancelled_by_type", length = 20)
    private String cancelledByType;

    // Foreign key to users table (managed by User Service)
    @Column(name = "cancelled_by_user_id")
    private Integer cancelledByUserId;

    // Foreign key to drivers table (managed by Driver Service)
    @Column(name = "cancelled_by_driver_id")
    private Integer cancelledByDriverId;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT", nullable = false)
    private String cancellationReason;

    @Column(name = "cancellation_fee", precision = 10, scale = 2)
    private BigDecimal cancellationFee = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}