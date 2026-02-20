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
 * REST Controller for Manual Dispatch Bookings
 * UI Endpoint: /admin/bookings/manual-dispatch
 */
@RestController
@RequestMapping("/api/bookings/manual-dispatch")
@RequiredArgsConstructor
@Slf4j
public class ManualDispatchController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/manual-dispatch
     * Get all manually dispatched bookings
     * (Bookings with manualDispatchOnly flag or manually assigned)
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getManualDispatchBookings() {
        log.info("GET /api/bookings/manual-dispatch - Fetching manual dispatch bookings");

        // Get dispatched bookings
        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.DISPATCHED, false);

        // In a real scenario, you might have a flag to identify manual dispatch
        // For now, returning all dispatched bookings

        return ResponseEntity.ok(bookings);
    }
}