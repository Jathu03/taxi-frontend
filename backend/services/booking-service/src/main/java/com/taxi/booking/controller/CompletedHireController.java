package com.taxi.booking.controller;

import com.taxi.booking.dto.request.BookingSearchRequest;
import com.taxi.booking.dto.response.BookingResponse;
import com.taxi.booking.dto.response.BookingSummaryResponse;
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
 * REST Controller for Completed Hires
 * UI Endpoint: /admin/bookings/completed-hires
 */
@RestController
@RequestMapping("/api/bookings/completed-hires")
@RequiredArgsConstructor
@Slf4j
public class CompletedHireController {

    private final BookingService bookingService;
    private final CsvExportService csvExportService;

    /**
     * GET /api/bookings/completed-hires
     * Get all completed hires with advanced filtering
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getCompletedHires(
            @RequestParam(required = false) String filterBy,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer bookedBy,
            @RequestParam(required = false) String hireType,
            @RequestParam(required = false) String paymentType,
            @RequestParam(required = false) Integer corporateId,
            @RequestParam(required = false) Integer vehicleClassId,
            @RequestParam(required = false) Integer fareSchemeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("GET /api/bookings/completed-hires - Fetching completed hires");

        BookingSearchRequest searchRequest = new BookingSearchRequest();
        searchRequest.setStatus(BookingStatus.COMPLETED);
        searchRequest.setFilterBy(filterBy);
        searchRequest.setSearchTerm(searchTerm);
        searchRequest.setBookedBy(bookedBy);
        searchRequest.setHireType(hireType);
        searchRequest.setPaymentType(paymentType);
        searchRequest.setCorporateId(corporateId);
        searchRequest.setVehicleClassId(vehicleClassId);
        searchRequest.setStartDate(startDate);
        searchRequest.setEndDate(endDate);
        searchRequest.setExcludeTestBookings(true);

        List<BookingResponse> bookings = bookingService.advancedSearch(searchRequest);

        // Additional filter for fare scheme
        if (fareSchemeId != null) {
            bookings = bookings.stream()
                    .filter(b -> fareSchemeId.equals(b.getFareSchemeId()))
                    .toList();
        }

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/bookings/completed-hires/summary
     * Get financial summary for completed hires
     */
    @GetMapping("/summary")
    public ResponseEntity<BookingSummaryResponse> getCompletedHiresSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("GET /api/bookings/completed-hires/summary - Calculating summary");

        BookingSummaryResponse summary = bookingService.getBookingSummary(startDate, endDate, true);
        return ResponseEntity.ok(summary);
    }

    /**
     * GET /api/bookings/completed-hires/export/csv
     * Export completed hires to CSV
     */
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCompletedHiresToCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate)
            throws IOException {

        log.info("GET /api/bookings/completed-hires/export/csv - Exporting completed hires");

        BookingSearchRequest searchRequest = new BookingSearchRequest();
        searchRequest.setStatus(BookingStatus.COMPLETED);
        searchRequest.setStartDate(startDate);
        searchRequest.setEndDate(endDate);
        searchRequest.setExcludeTestBookings(true);

        List<BookingResponse> bookings = bookingService.advancedSearch(searchRequest);
        byte[] csvData = csvExportService.exportCompletedHiresToCsv(bookings);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "completed_hires_export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}