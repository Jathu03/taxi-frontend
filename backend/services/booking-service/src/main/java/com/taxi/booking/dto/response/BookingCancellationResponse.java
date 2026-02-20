package com.taxi.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for Booking Cancellation response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCancellationResponse {

    private Integer id;
    private Integer bookingId;
    private String bookingNumber;
    private LocalDateTime cancelledTime;
    private String cancelledType;
    private String cancelledByType;

    // User Information (from User Service)
    private Integer cancelledByUserId;
    private String cancelledByUserName;

    // Driver Information (from Driver Service)
    private Integer cancelledByDriverId;
    private String cancelledByDriverName;

    private String cancellationReason;
    private BigDecimal cancellationFee;
    private LocalDateTime createdAt;
}