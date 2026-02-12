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
 * REST Controller for Dispatched Bookings
 * UI Endpoint: /admin/bookings/dispatched
 */
@RestController
@RequestMapping("/api/bookings/dispatched")
@RequiredArgsConstructor
@Slf4j
public class DispatchedBookingController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/dispatched
     * Get all dispatched bookings
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getDispatchedBookings(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer driverId,
            @RequestParam(required = false) Integer corporateId) {

        log.info("GET /api/bookings/dispatched - Fetching dispatched bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.DISPATCHED, false);

        // Apply filters
        if (driverId != null) {
            bookings = bookings.stream()
                    .filter(b -> driverId.equals(b.getDriverId()))
                    .toList();
        }

        if (corporateId != null) {
            bookings = bookings.stream()
                    .filter(b -> corporateId.equals(b.getCorporateId()))
                    .toList();
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String lowerSearchTerm = searchTerm.toLowerCase();
            bookings = bookings.stream()
                    .filter(b -> b.getCustomerName().toLowerCase().contains(lowerSearchTerm) ||
                            b.getContactNumber().contains(searchTerm))
                    .toList();
        }

        return ResponseEntity.ok(bookings);
    }
}