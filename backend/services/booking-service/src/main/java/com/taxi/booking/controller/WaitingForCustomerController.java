package com.taxi.booking.controller;

import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Waiting For Customer Bookings
 * UI Endpoint: /admin/bookings/waiting-for-customer
 */
@RestController
@RequestMapping("/api/bookings/waiting-for-customer")
@RequiredArgsConstructor
@Slf4j
public class WaitingForCustomerController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/waiting-for-customer
     * Get all bookings where driver is waiting for customer
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getWaitingForCustomerBookings() {
        log.info("GET /api/bookings/waiting-for-customer - Fetching waiting bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(
                BookingStatus.WAITING_FOR_CUSTOMER, true);

        return ResponseEntity.ok(bookings);
    }
}