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
 * REST Controller for Passenger Onboard Bookings
 * UI Endpoint: /admin/bookings/passenger-onboard
 */
@RestController
@RequestMapping("/api/bookings/passenger-onboard")
@RequiredArgsConstructor
@Slf4j
public class PassengerOnboardController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/passenger-onboard
     * Get all bookings with passenger onboard (trip in progress)
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getPassengerOnboardBookings() {
        log.info("GET /api/bookings/passenger-onboard - Fetching passenger onboard bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(
                BookingStatus.PASSENGER_ONBOARD, true);

        return ResponseEntity.ok(bookings);
    }
}