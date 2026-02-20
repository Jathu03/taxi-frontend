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
 * REST Controller for Pending Bookings
 * UI Endpoint: /admin/bookings/pending
 */
@RestController
@RequestMapping("/api/bookings/pending")
@RequiredArgsConstructor
@Slf4j
public class PendingBookingController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/pending
     * Get all pending bookings (excluding app bookings)
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getPendingBookings(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer corporateId) {

        log.info("GET /api/bookings/pending - Fetching pending bookings");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.PENDING, true);

        // Exclude app bookings (ANDROID, IOS)
        bookings = bookings.stream()
                .filter(b -> !"ANDROID".equals(b.getAppPlatform()) && !"IOS".equals(b.getAppPlatform()))
                .toList();

        // Apply filters
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