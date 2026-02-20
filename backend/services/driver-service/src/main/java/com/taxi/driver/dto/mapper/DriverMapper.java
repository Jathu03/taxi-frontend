package com.taxi.driver.dto.mapper;

import com.taxi.driver.dto.request.DriverCreateRequest;
import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.dto.response.DriverDetailResponse;
import com.taxi.driver.dto.response.DriverResponse;
import com.taxi.driver.entity.Driver;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DriverMapper {

    private final DriverActivityLogMapper activityLogMapper;

    public DriverMapper(DriverActivityLogMapper activityLogMapper) {
        this.activityLogMapper = activityLogMapper;
    }

    public Driver toEntity(DriverCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Driver.builder()
                .code(request.getCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .nic(request.getNic())
                .birthDate(request.getBirthDate())
                .contactNumber(request.getContactNumber())
                .emergencyNumber(request.getEmergencyNumber())
                .address(request.getAddress())
                .profileImageUrl(request.getProfileImageUrl())
                .manualDispatchOnly(request.getManualDispatchOnly() != null ? request.getManualDispatchOnly() : false)
                .licenseNumber(request.getLicenseNumber())
                .licenseExpiryDate(request.getLicenseExpiryDate())
                .licenseImageUrl(request.getLicenseImageUrl())
                .vehicleId(request.getVehicleId())
                .userId(request.getUserId())
                .companyId(request.getCompanyId())
                .build();
    }

    public DriverResponse toResponse(Driver driver) {
        if (driver == null) {
            return null;
        }

        return DriverResponse.builder()
                .id(driver.getId())
                .code(driver.getCode())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .fullName(buildFullName(driver.getFirstName(), driver.getLastName()))
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
                .lastLocation(driver.getLastLocation())
                .lastLocationTime(driver.getLastLocationTime())
                .averageRating(driver.getAverageRating())
                .ratingCount(driver.getRatingCount())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .build();
    }

    public DriverDetailResponse toDetailResponse(Driver driver) {
        if (driver == null) {
            return null;
        }

        List<DriverActivityLogResponse> recentLogs = Collections.emptyList();
        if (driver.getActivityLogs() != null && !driver.getActivityLogs().isEmpty()) {
            recentLogs = driver.getActivityLogs().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(20)
                    .map(activityLogMapper::toResponse)
                    .collect(Collectors.toList());
        }

        Integer licenseDaysRemaining = null;
        String licenseStatus = null;
        if (driver.getLicenseExpiryDate() != null) {
            licenseDaysRemaining = (int) ChronoUnit.DAYS.between(LocalDate.now(), driver.getLicenseExpiryDate());
            if (licenseDaysRemaining < 0) {
                licenseStatus = "EXPIRED";
            } else if (licenseDaysRemaining <= 30) {
                licenseStatus = "EXPIRING_SOON";
            } else {
                licenseStatus = "VALID";
            }
        }

        return DriverDetailResponse.builder()
                .id(driver.getId())
                .code(driver.getCode())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .fullName(buildFullName(driver.getFirstName(), driver.getLastName()))
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
                .licenceDaysRemaining(licenseDaysRemaining)
                .licenseStatus(licenseStatus)
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .recentActivityLogs(recentLogs)
                .build();
    }

    public List<DriverResponse> toResponseList(List<Driver> drivers) {
        if (drivers == null) {
            return Collections.emptyList();
        }
        return drivers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private String buildFullName(String firstName, String lastName) {
        if (lastName == null || lastName.isBlank()) {
            return firstName;
        }
        return firstName + " " + lastName;
    }
}