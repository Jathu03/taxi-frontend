package com.taxi.booking.controller;

import com.taxi.booking.dto.request.BookingSearchRequest;
import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Inquiry Bookings
 * UI Endpoint: /admin/bookings/inquiries
 */
@RestController
@RequestMapping("/api/bookings/inquiries")
@RequiredArgsConstructor
@Slf4j
public class InquiryController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings/inquiries
     * Get all inquiry bookings
     * Query params: filterBy, searchTerm, startDate, endDate
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getInquiries(
            @RequestParam(required = false) String filterBy,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String hireType,
            @RequestParam(required = false) Integer corporateId) {

        log.info("GET /api/bookings/inquiries - Fetching inquiry bookings");

        List<BookingResponse> inquiries = bookingService.getInquiries();

        // Apply additional filters if provided
        if (hireType != null) {
            inquiries = inquiries.stream()
                    .filter(b -> hireType.equals(b.getHireType()))
                    .toList();
        }

        if (corporateId != null) {
            inquiries = inquiries.stream()
                    .filter(b -> corporateId.equals(b.getCorporateId()))
                    .toList();
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty() && filterBy != null) {
            String lowerSearchTerm = searchTerm.toLowerCase();
            inquiries = inquiries.stream()
                    .filter(b -> {
                        return switch (filterBy.toLowerCase()) {
                            case "phone" -> b.getContactNumber().contains(searchTerm);
                            case "customername" -> b.getCustomerName().toLowerCase().contains(lowerSearchTerm);
                            default -> true;
                        };
                    })
                    .toList();
        }

        return ResponseEntity.ok(inquiries);
    }
}