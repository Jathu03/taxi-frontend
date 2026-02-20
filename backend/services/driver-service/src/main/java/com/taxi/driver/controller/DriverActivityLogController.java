package com.taxi.driver.controller;

import com.taxi.driver.dto.request.DriverActivityLogCreateRequest;
import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.dto.response.PagedResponse;
import com.taxi.driver.service.DriverActivityLogService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/driver-activity-logs")
public class DriverActivityLogController {

        private final DriverActivityLogService activityLogService;

        public DriverActivityLogController(DriverActivityLogService activityLogService) {
                this.activityLogService = activityLogService;
        }

        // ======================== CREATE ========================

        @PostMapping
        public ResponseEntity<DriverActivityLogResponse> createActivityLog(
                        @Valid @RequestBody DriverActivityLogCreateRequest request) {
                DriverActivityLogResponse response = activityLogService.createActivityLog(request);
                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        // ======================== RETRIEVE ========================

        @GetMapping("/{id}")
        public ResponseEntity<DriverActivityLogResponse> getActivityLogById(@PathVariable Integer id) {
                DriverActivityLogResponse response = activityLogService.getActivityLogById(id);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/driver/{driverId}")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByDriverId(
                        @PathVariable Integer driverId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByDriverId(
                                driverId, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/driver/{driverId}/type/{activityType}")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByDriverIdAndType(
                        @PathVariable Integer driverId,
                        @PathVariable String activityType,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByDriverIdAndType(
                                driverId, activityType, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/driver/{driverId}/date-range")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByDriverIdAndDateRange(
                        @PathVariable Integer driverId,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByDriverIdAndDateRange(
                                driverId, startDate, endDate, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/driver/{driverId}/filter")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByDriverIdWithFilters(
                        @PathVariable Integer driverId,
                        @RequestParam(required = false) String activityType,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByDriverIdWithFilters(
                                driverId, activityType, logDate, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/date-range")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByDateRange(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByDateRange(
                                startDate, endDate, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/type/{activityType}")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByActivityType(
                        @PathVariable String activityType,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByActivityType(
                                activityType, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/date/{logDate}")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByDate(
                        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByDate(
                                logDate, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        @GetMapping("/vehicle/{vehicleId}")
        public ResponseEntity<PagedResponse<DriverActivityLogResponse>> getLogsByVehicleId(
                        @PathVariable Integer vehicleId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {
                PagedResponse<DriverActivityLogResponse> response = activityLogService.getLogsByVehicleId(
                                vehicleId, page, size, sortBy, sortDir);
                return ResponseEntity.ok(response);
        }

        // ======================== STATISTICS ========================

        @GetMapping("/driver/{driverId}/stats/activity-counts")
        public ResponseEntity<Map<String, Long>> getActivityTypeCountsForDriver(@PathVariable Integer driverId) {
                Map<String, Long> counts = activityLogService.getActivityTypeCountsForDriver(driverId);
                return ResponseEntity.ok(counts);
        }

        @GetMapping("/stats/activity-counts")
        public ResponseEntity<Map<String, Long>> getActivityTypeCountsForDateRange(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
                Map<String, Long> counts = activityLogService.getActivityTypeCountsForDateRange(startDate, endDate);
                return ResponseEntity.ok(counts);
        }

        @GetMapping("/driver/{driverId}/stats/online-duration")
        public ResponseEntity<Map<String, Long>> getTotalOnlineDurationForDriver(
                        @PathVariable Integer driverId,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
                Long duration = activityLogService.getTotalOnlineDurationForDriver(driverId, startDate, endDate);
                return ResponseEntity.ok(Map.of("totalOnlineDurationMinutes", duration));
        }

        @GetMapping("/driver/{driverId}/stats/count")
        public ResponseEntity<Map<String, Long>> getLogCountForDriver(@PathVariable Integer driverId) {
                long count = activityLogService.getLogCountForDriver(driverId);
                return ResponseEntity.ok(Map.of("totalLogs", count));
        }
}