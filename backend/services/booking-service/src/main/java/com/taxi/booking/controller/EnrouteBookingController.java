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
 * REST Controller for Enroute Bookings
 * UI Endpoint: /admin/bookings/enroute
 */
@RestController
@RequestMapping("/api/bookings/enroute")
@RequiredArgsConstructor
@Slf4j
public class EnrouteBookingController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/enroute
     * Get all enroute bookings (driver heading to pickup)
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getEnrouteBookings(
            @RequestParam(required = false) String searchTerm) {

        log.info("GET /api/bookings/enroute - Fetching enroute bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.ENROUTE, true);

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String lowerSearchTerm = searchTerm.toLowerCase();
            bookings = bookings.stream()
                    .filter(b -> b.getCustomerName().toLowerCase().contains(lowerSearchTerm))
                    .toList();
        }

        return ResponseEntity.ok(bookings);
    }
}