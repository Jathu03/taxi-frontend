package com.taxi.driver.controller;

import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.service.DriverActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Driver Activity Log operations
 * Provides endpoints for viewing driver activity logs
 * UI Endpoint: /admin/drivers/activity-log
 */
@RestController
@RequestMapping("/api/driver-activity-logs")
@RequiredArgsConstructor
@Slf4j
public class DriverActivityLogController {

        private final DriverActivityLogService activityLogService;

        /**
         * GET /api/driver-activity-logs
         * Get activity logs with optional filtering
         * Used by: /admin/drivers/activity-log
         * Query params:
         * - filterType: firstName|code|contactNumber
         * - searchTerm: search string
         * - startDate: filter start date (required)
         * - endDate: filter end date (required)
         * - driverId: specific driver ID (optional)
         */
        @GetMapping
        public ResponseEntity<List<DriverActivityLogResponse>> getActivityLogs(
                        @RequestParam(required = false) String filterType,
                        @RequestParam(required = false) String searchTerm,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                        @RequestParam(required = false) Integer driverId) {

                log.info("GET /api/driver-activity-logs - filterType: {}, searchTerm: {}, dates: {} to {}, driverId: {}",
                                filterType, searchTerm, startDate, endDate, driverId);

                List<DriverActivityLogResponse> logs;

                if (driverId != null) {
                        // Get logs for specific driver
                        logs = activityLogService.getActivityLogsByDriverAndDateRange(driverId, startDate, endDate);
                } else if (searchTerm != null && !searchTerm.trim().isEmpty() && filterType != null) {
                        // Search logs by filter
                        logs = activityLogService.searchActivityLogs(filterType, searchTerm, startDate, endDate);
                } else {
                        // Get all logs for date range
                        logs = activityLogService.getActivityLogsByDateRange(startDate, endDate);
                }

                return ResponseEntity.ok(logs);
        }

        /**
         * GET /api/driver-activity-logs/driver/{driverId}
         * Get all activity logs for a specific driver
         * Used by: Driver detail view
         */
        @GetMapping("/driver/{driverId}")
        public ResponseEntity<List<DriverActivityLogResponse>> getActivityLogsByDriver(
                        @PathVariable Integer driverId) {

                log.info("GET /api/driver-activity-logs/driver/{} - Fetching activity logs", driverId);
                List<DriverActivityLogResponse> logs = activityLogService.getActivityLogsByDriver(driverId);
                return ResponseEntity.ok(logs);
        }
}