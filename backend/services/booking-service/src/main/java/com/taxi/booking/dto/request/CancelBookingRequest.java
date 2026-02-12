package com.taxi.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for cancelling a booking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelBookingRequest {

    @NotBlank(message = "Cancellation reason is required")
    private String cancellationReason;

    private String cancelledType;
    private String cancelledByType;
    private Integer cancelledByUserId;
    private Integer cancelledByDriverId;
    private BigDecimal cancellationFee;
}