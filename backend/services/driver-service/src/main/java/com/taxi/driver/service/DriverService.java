package com.taxi.driver.service;

import com.taxi.driver.dto.request.DriverBlockRequest;
import com.taxi.driver.dto.request.DriverCreateRequest;
import com.taxi.driver.dto.request.DriverUpdateRequest;
import com.taxi.driver.dto.response.DriverDetailResponse;
import com.taxi.driver.dto.response.DriverResponse;
import com.taxi.driver.dto.response.PagedResponse;

import java.util.List;
import java.util.Map;

public interface DriverService {

    DriverResponse createDriver(DriverCreateRequest request);

    DriverResponse updateDriver(Integer id, DriverUpdateRequest request);

    DriverDetailResponse getDriverById(Integer id);

    DriverDetailResponse getDriverByCode(String code);

    DriverDetailResponse getDriverByContactNumber(String contactNumber);

    PagedResponse<DriverResponse> getAllDrivers(int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getActiveDrivers(int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getBlockedDrivers(int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getVerifiedDrivers(int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getUnverifiedDrivers(int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getDriversByCompany(Integer companyId, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverResponse> searchDrivers(String keyword, int page, int size,
            String sortBy, String sortDir);

    PagedResponse<DriverResponse> getDriversByFilters(Boolean isActive, Boolean isBlocked, Boolean isVerified,
            Integer companyId, Boolean manualDispatchOnly,
            int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getUnassignedDrivers(int page, int size, String sortBy, String sortDir);

    PagedResponse<DriverResponse> getAvailableDrivers(int page, int size, String sortBy, String sortDir);

    List<DriverResponse> getDriversByVehicleId(Integer vehicleId);

    List<DriverResponse> getDriversWithExpiredLicense();

    List<DriverResponse> getDriversWithExpiringLicense(int daysThreshold);

    DriverResponse blockDriver(Integer id, DriverBlockRequest request);

    DriverResponse unblockDriver(Integer id);

    DriverResponse verifyDriver(Integer id);

    DriverResponse activateDriver(Integer id);

    DriverResponse deactivateDriver(Integer id);

    DriverResponse assignVehicle(Integer id, Integer vehicleId);

    DriverResponse unassignVehicle(Integer id);

    DriverResponse updateLocation(Integer id, String location, String latitude, String longitude);

    void deleteDriver(Integer id);

    Map<String, Long> getDriverStatistics();
}