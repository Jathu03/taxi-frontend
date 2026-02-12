package com.taxi.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for Booking Summary (Financial Summary)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSummaryResponse {

    private Long totalBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Long pendingBookings;

    private BigDecimal totalHireAmount;
    private BigDecimal totalDiscountAmount;
    private BigDecimal totalCommissions;
    private BigDecimal totalNetAmount;
    private BigDecimal totalWaitingFees;

    private BigDecimal averageFare;
    private BigDecimal averageDistance;
}