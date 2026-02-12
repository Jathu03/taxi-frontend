package com.taxi.driver.service;

import com.taxi.driver.client.UserServiceClient;
import com.taxi.driver.client.VehicleServiceClient;
import com.taxi.driver.dto.request.CreateDriverRequest;
import com.taxi.driver.dto.request.UpdateDriverRequest;
import com.taxi.driver.dto.response.*;
import com.taxi.driver.entity.Driver;
import com.taxi.driver.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Driver operations
 * Handles business logic for driver management including CRUD operations
 * Communicates with User Service and Vehicle Service for related data
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserServiceClient userServiceClient;
    private final VehicleServiceClient vehicleServiceClient;

    /**
     * Create a new driver
     * Validates uniqueness of driver code and contact number
     */
    @Transactional
    public DriverResponse createDriver(CreateDriverRequest request) {
        log.info("Creating new driver with code: {}", request.getCode());

        // Check for duplicate driver code
        if (driverRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Driver code already exists: " + request.getCode());
        }

        // Check for duplicate contact number
        if (driverRepository.existsByContactNumber(request.getContactNumber())) {
            throw new RuntimeException("Contact number already exists: " + request.getContactNumber());
        }

        Driver driver = new Driver();
        driver.setCode(request.getCode());
        driver.setFirstName(request.getFirstName());
        driver.setLastName(request.getLastName());
        driver.setNic(request.getNic());
        driver.setBirthDate(request.getBirthDate());
        driver.setContactNumber(request.getContactNumber());
        driver.setEmergencyNumber(request.getEmergencyNumber());
        driver.setAddress(request.getAddress());
        driver.setIsBlocked(request.getIsBlocked());
        driver.setBlockedDescription(request.getBlockedDescription());
        driver.setManualDispatchOnly(request.getManualDispatchOnly());
        driver.setIsVerified(request.getIsVerified());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseExpiryDate(request.getLicenseExpiryDate());
        driver.setVehicleId(request.getVehicleId());
        driver.setUserId(request.getUserId());
        driver.setCompanyId(request.getCompanyId());
        driver.setIsActive(true);

        Driver savedDriver = driverRepository.save(driver);
        log.info("Driver created successfully with id: {}", savedDriver.getId());

        return convertToDriverResponse(savedDriver);
    }

    /**
     * Get all drivers
     * Returns list of all drivers in the system
     */
    @Transactional(readOnly = true)
    public List<DriverResponse> getAllDrivers() {
        log.debug("Fetching all drivers");
        List<Driver> drivers = driverRepository.findAll();
        return drivers.stream()
                .map(this::convertToDriverResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get driver by ID
     * Used by other services (e.g., Booking Service)
     */
    @Transactional(readOnly = true)
    public DriverResponse getDriverById(Integer id) {
        log.debug("Fetching driver with id: {}", id);
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        return convertToDriverResponse(driver);
    }

    /**
     * Get driver by code
     */
    @Transactional(readOnly = true)
    public DriverResponse getDriverByCode(String code) {
        log.debug("Fetching driver with code: {}", code);
        Driver driver = driverRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Driver not found with code: " + code));
        return convertToDriverResponse(driver);
    }

    /**
     * Search drivers based on filter type
     * filterType: "firstName", "code", or "contactNumber"
     */
    @Transactional(readOnly = true)
    public List<DriverResponse> searchDrivers(String filterType, String searchTerm) {
        log.debug("Searching drivers with filterType: {} and searchTerm: {}", filterType, searchTerm);

        List<Driver> drivers;
        if (searchTerm != null && !searchTerm.trim().isEmpty() && filterType != null) {
            drivers = driverRepository.searchDrivers(filterType, searchTerm);
        } else {
            drivers = driverRepository.findAll();
        }

        return drivers.stream()
                .map(this::convertToDriverResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update existing driver
     * Validates uniqueness of driver code and contact for other drivers
     */
    @Transactional
    public DriverResponse updateDriver(Integer id, UpdateDriverRequest request) {
        log.info("Updating driver with id: {}", id);

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));

        // Check driver code uniqueness (excluding current driver)
        if (!driver.getCode().equals(request.getCode()) &&
                driverRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Driver code already exists: " + request.getCode());
        }

        // Check contact number uniqueness (excluding current driver)
        if (!driver.getContactNumber().equals(request.getContactNumber()) &&
                driverRepository.existsByContactNumber(request.getContactNumber())) {
            throw new RuntimeException("Contact number already exists: " + request.getContactNumber());
        }

        driver.setCode(request.getCode());
        driver.setFirstName(request.getFirstName());
        driver.setLastName(request.getLastName());
        driver.setNic(request.getNic());
        driver.setBirthDate(request.getBirthDate());
        driver.setContactNumber(request.getContactNumber());
        driver.setEmergencyNumber(request.getEmergencyNumber());
        driver.setAddress(request.getAddress());
        driver.setIsBlocked(request.getIsBlocked());
        driver.setBlockedDescription(request.getBlockedDescription());
        driver.setManualDispatchOnly(request.getManualDispatchOnly());
        driver.setIsVerified(request.getIsVerified());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseExpiryDate(request.getLicenseExpiryDate());
        driver.setVehicleId(request.getVehicleId());
        driver.setUserId(request.getUserId());
        driver.setCompanyId(request.getCompanyId());

        if (request.getIsActive() != null) {
            driver.setIsActive(request.getIsActive());
        }

        Driver updatedDriver = driverRepository.save(driver);
        log.info("Driver updated successfully with id: {}", id);

        return convertToDriverResponse(updatedDriver);
    }

    /**
     * Delete driver by ID
     */
    @Transactional
    public void deleteDriver(Integer id) {
        log.info("Deleting driver with id: {}", id);

        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Driver not found with id: " + id);
        }

        driverRepository.deleteById(id);
        log.info("Driver deleted successfully with id: {}", id);
    }

    /**
     * Get all active drivers
     * Used by Booking Service for driver selection
     */
    @Transactional(readOnly = true)
    public List<DriverResponse> getActiveDrivers() {
        log.debug("Fetching all active drivers");
        List<Driver> drivers = driverRepository.findByIsActiveTrue();
        return drivers.stream()
                .map(this::convertToDriverResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get drivers by company ID
     */
    @Transactional(readOnly = true)
    public List<DriverResponse> getDriversByCompany(Integer companyId) {
        log.debug("Fetching drivers for company id: {}", companyId);
        List<Driver> drivers = driverRepository.findByCompanyId(companyId);
        return drivers.stream()
                .map(this::convertToDriverResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert Driver entity to DriverResponse DTO
     * Fetches vehicle, user, and company information from respective services
     */
    private DriverResponse convertToDriverResponse(Driver driver) {
        DriverResponse response = DriverResponse.builder()
                .id(driver.getId())
                .code(driver.getCode())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .nic(driver.getNic())
                .birthDate(driver.getBirthDate())
                .contactNumber(driver.getContactNumber())
                .emergencyNumber(driver.getEmergencyNumber())
                .address(driver.getAddress())
                .profileImageUrl(driver.getProfileImageUrl())
                .isBlocked(driver.getIsBlocked())
                .blockedDescription(driver.getBlockedDescription())
                .manualDispatchOnly(driver.getManualDispatchOnly())
                .isVerified(driver.getIsVerified())
                .isActive(driver.getIsActive())
                .licenseNumber(driver.getLicenseNumber())
                .licenseExpiryDate(driver.getLicenseExpiryDate())
                .licenseImageUrl(driver.getLicenseImageUrl())
                .vehicleId(driver.getVehicleId())
                .userId(driver.getUserId())
                .companyId(driver.getCompanyId())
                .appVersion(driver.getAppVersion())
                .deviceToken(driver.getDeviceToken())
                .lastLocation(driver.getLastLocation())
                .lastLocationTime(driver.getLastLocationTime())
                .averageRating(driver.getAverageRating())
                .ratingCount(driver.getRatingCount())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .build();

        // Fetch vehicle details from Vehicle Service
        if (driver.getVehicleId() != null) {
            try {
                VehicleResponse vehicle = vehicleServiceClient.getVehicleById(driver.getVehicleId());
                response.setVehicleCode(vehicle.getVehicleCode());
                response.setVehicleRegistrationNumber(vehicle.getRegistrationNumber());
            } catch (Exception e) {
                log.warn("Failed to fetch vehicle details for driver: {}", e.getMessage());
            }
        }

        // Fetch user details from User Service
        if (driver.getUserId() != null) {
            try {
                UserResponse user = userServiceClient.getUserById(driver.getUserId());
                response.setUsername(user.getUsername());
            } catch (Exception e) {
                log.warn("Failed to fetch user details for driver: {}", e.getMessage());
            }
        }

        // Fetch company details from Vehicle Service
        if (driver.getCompanyId() != null) {
            try {
                CompanyResponse company = vehicleServiceClient.getCompanyById(driver.getCompanyId());
                response.setCompanyName(company.getCompanyName());
            } catch (Exception e) {
                log.warn("Failed to fetch company details for driver: {}", e.getMessage());
            }
        }

        return response;
    }
}