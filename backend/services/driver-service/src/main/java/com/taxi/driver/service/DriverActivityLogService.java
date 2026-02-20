package com.taxi.driver.service;

import com.taxi.driver.dto.request.DriverActivityLogCreateRequest;
import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.dto.response.PagedResponse;

import java.time.LocalDate;
import java.util.Map;

public interface DriverActivityLogService {

    DriverActivityLogResponse createActivityLog(DriverActivityLogCreateRequest request);

    DriverActivityLogResponse getActivityLogById(Integer id);

    PagedResponse<DriverActivityLogResponse> getLogsByDriverId(Integer driverId, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByDriverIdAndType(Integer driverId, String activityType,
            int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByDriverIdAndDateRange(Integer driverId,
            LocalDate startDate,
            LocalDate endDate,
            int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByDriverIdWithFilters(Integer driverId,
            String activityType,
            LocalDate logDate,
            int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByDateRange(LocalDate startDate, LocalDate endDate,
            int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByActivityType(String activityType, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByDate(LocalDate logDate, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverActivityLogResponse> getLogsByVehicleId(Integer vehicleId, int page, int size,
            String sortBy, String sortDir);

    Map<String, Long> getActivityTypeCountsForDriver(Integer driverId);

    Map<String, Long> getActivityTypeCountsForDateRange(LocalDate startDate, LocalDate endDate);

    Long getTotalOnlineDurationForDriver(Integer driverId, LocalDate startDate, LocalDate endDate);

    long getLogCountForDriver(Integer driverId);
}