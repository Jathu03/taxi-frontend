package com.taxi.driver.service;

import com.taxi.driver.client.VehicleServiceClient;
import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.dto.response.VehicleResponse;
import com.taxi.driver.entity.Driver;
import com.taxi.driver.entity.DriverActivityLog;
import com.taxi.driver.repository.DriverActivityLogRepository;
import com.taxi.driver.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Driver Activity Log operations
 * Handles business logic for driver activity tracking
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DriverActivityLogService {

    private final DriverActivityLogRepository activityLogRepository;
    private final DriverRepository driverRepository;
    private final VehicleServiceClient vehicleServiceClient;

    /**
     * Get all activity logs
     */
    public List<DriverActivityLogResponse> getAllActivityLogs() {
        log.debug("Fetching all activity logs");
        List<DriverActivityLog> logs = activityLogRepository.findAll();
        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get activity logs by driver ID
     */
    public List<DriverActivityLogResponse> getActivityLogsByDriver(Integer driverId) {
        log.debug("Fetching activity logs for driver id: {}", driverId);
        List<DriverActivityLog> logs = activityLogRepository.findByDriverIdOrderByLogDateDesc(driverId);
        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get activity logs by date range
     */
    public List<DriverActivityLogResponse> getActivityLogsByDateRange(LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching activity logs between {} and {}", startDate, endDate);
        List<DriverActivityLog> logs = activityLogRepository.findByLogDateBetweenOrderByLogDateDesc(startDate, endDate);
        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search activity logs by filter type and date range
     * filterType: "firstName", "code", or "contactNumber"
     */
    public List<DriverActivityLogResponse> searchActivityLogs(
            String filterType, String searchTerm, LocalDate startDate, LocalDate endDate) {

        log.debug("Searching activity logs with filterType: {}, searchTerm: {}, dates: {} to {}",
                filterType, searchTerm, startDate, endDate);

        List<DriverActivityLog> logs;

        if (searchTerm != null && !searchTerm.trim().isEmpty() && filterType != null) {
            logs = activityLogRepository.searchActivityLogs(filterType, searchTerm, startDate, endDate);
        } else {
            logs = activityLogRepository.findByLogDateBetweenOrderByLogDateDesc(startDate, endDate);
        }

        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get activity logs by driver and date range
     */
    public List<DriverActivityLogResponse> getActivityLogsByDriverAndDateRange(
            Integer driverId, LocalDate startDate, LocalDate endDate) {

        log.debug("Fetching activity logs for driver {} between {} and {}", driverId, startDate, endDate);
        List<DriverActivityLog> logs = activityLogRepository.findByDriverIdAndLogDateBetweenOrderByLogDateDesc(
                driverId, startDate, endDate);
        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert DriverActivityLog entity to DriverActivityLogResponse DTO
     * Fetches vehicle information from Vehicle Service
     */
    private DriverActivityLogResponse convertToResponse(DriverActivityLog log) {
        Driver driver = log.getDriver();

        DriverActivityLogResponse response = DriverActivityLogResponse.builder()
                .id(log.getId())
                .driverId(driver.getId())
                .driverCode(driver.getCode())
                .driverFirstName(driver.getFirstName())
                .driverLastName(driver.getLastName())
                .driverContactNumber(driver.getContactNumber())
                .activityType(log.getActivityType())
                .vehicleId(log.getVehicleId())
                .vehicleCode(log.getVehicleCode())
                .location(log.getLocation())
                .latitude(log.getLatitude())
                .longitude(log.getLongitude())
                .onlineTime(log.getOnlineTime())
                .offlineTime(log.getOfflineTime())
                .totalOnlineDuration(log.getTotalOnlineDuration())
                .logDate(log.getLogDate())
                .createdAt(log.getCreatedAt())
                .build();

        // Fetch vehicle model from Vehicle Service
        if (log.getVehicleId() != null) {
            try {
                VehicleResponse vehicle = vehicleServiceClient.getVehicleById(log.getVehicleId());
                response.setVehicleModel(vehicle.getModel());
            } catch (Exception e) {
                System.out.println("Failed to fetch vehicle details for activity log: " + e.getMessage());
            }
        }

        return response;
    }
}