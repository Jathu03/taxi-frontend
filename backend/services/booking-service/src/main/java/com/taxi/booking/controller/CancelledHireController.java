package com.taxi.booking.controller;

import com.taxi.booking.dto.response.BookingCancellationResponse;
import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.service.BookingService;
import com.taxi.booking.service.CsvExportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Cancelled Hires
 * UI Endpoint: /admin/bookings/cancelled-hires
 */
@RestController
@RequestMapping("/api/bookings/cancelled-hires")
@RequiredArgsConstructor
@Slf4j
public class CancelledHireController {

    private final BookingService bookingService;
    private final CsvExportService csvExportService;

    /**
     * GET /api/bookings/cancelled-hires
     * Get all cancelled hires with filters
     */
    @GetMapping
    public ResponseEntity<List<BookingCancellationResponse>> getCancelledHires(
            @RequestParam(required = false) String filterBy,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer bookedBy,
            @RequestParam(required = false) String hireType,
            @RequestParam(required = false) String paymentType,
            @RequestParam(required = false) String cancelledType,
            @RequestParam(required = false) Integer corporateId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("GET /api/bookings/cancelled-hires - Fetching cancelled hires");

        List<BookingCancellationResponse> cancellations = bookingService.getCancelledBookings(startDate, endDate);

        // Apply additional filters
        if (cancelledType != null) {
            cancellations = cancellations.stream()
                    .filter(c -> cancelledType.equals(c.getCancelledType()))
                    .toList();
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty() && filterBy != null) {
            String lowerSearchTerm = searchTerm.toLowerCase();
            cancellations = cancellations.stream()
                    .filter(c -> {
                        return switch (filterBy.toLowerCase()) {
                            case "phone" -> c.getBookingNumber().contains(searchTerm);
                            default -> true;
                        };
                    })
                    .toList();
        }

        return ResponseEntity.ok(cancellations);
    }

    /**
     * GET /api/bookings/cancelled-hires/export/csv
     * Export cancelled hires to CSV
     */
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCancelledHiresToCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate)
            throws IOException {

        log.info("GET /api/bookings/cancelled-hires/export/csv - Exporting cancelled hires");

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.CANCELLED, true);
        byte[] csvData = csvExportService.exportCancelledHiresToCsv(bookings);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "cancelled_hires_export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}