package com.taxi.booking.dto.request;

import com.taxi.booking.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for advanced booking search
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSearchRequest {

    private String searchTerm;
    private String filterBy; // phone, email, customerName, bookingId, voucherNumber

    private BookingStatus status;
    private Integer vehicleClassId;
    private Integer corporateId;
    private Integer driverId;
    private Integer bookedBy;
    private String hireType;
    private String paymentType;
    private String bookingSource;
    private String cancelledType;

    private LocalDate startDate;
    private LocalDate endDate;

    private Boolean excludeTestBookings = true;
}