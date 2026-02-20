package com.taxi.driver.service;

import com.taxi.driver.dto.mapper.DriverMapper;
import com.taxi.driver.dto.request.DriverBlockRequest;
import com.taxi.driver.dto.request.DriverCreateRequest;
import com.taxi.driver.dto.request.DriverUpdateRequest;
import com.taxi.driver.dto.response.DriverDetailResponse;
import com.taxi.driver.dto.response.DriverResponse;
import com.taxi.driver.dto.response.PagedResponse;
import com.taxi.driver.entity.Driver;
import com.taxi.driver.repository.DriverRepository;
import com.taxi.driver.service.DriverService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;

    public DriverServiceImpl(DriverRepository driverRepository, DriverMapper driverMapper) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
    }

    @Override
    public DriverResponse createDriver(DriverCreateRequest request) {
        if (driverRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Driver with code '" + request.getCode() + "' already exists");
        }
        if (driverRepository.existsByContactNumber(request.getContactNumber())) {
            throw new IllegalArgumentException(
                    "Driver with contact number '" + request.getContactNumber() + "' already exists");
        }

        Driver driver = driverMapper.toEntity(request);
        Driver savedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(savedDriver);
    }

    @Override
    public DriverResponse updateDriver(Integer id, DriverUpdateRequest request) {
        Driver driver = findDriverOrThrow(id);

        if (request.getFirstName() != null) {
            driver.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            driver.setLastName(request.getLastName());
        }
        if (request.getNic() != null) {
            driver.setNic(request.getNic());
        }
        if (request.getBirthDate() != null) {
            driver.setBirthDate(request.getBirthDate());
        }
        if (request.getContactNumber() != null) {
            if (!request.getContactNumber().equals(driver.getContactNumber())
                    && driverRepository.existsByContactNumber(request.getContactNumber())) {
                throw new IllegalArgumentException(
                        "Contact number '" + request.getContactNumber() + "' is already in use");
            }
            driver.setContactNumber(request.getContactNumber());
        }
        if (request.getEmergencyNumber() != null) {
            driver.setEmergencyNumber(request.getEmergencyNumber());
        }
        if (request.getAddress() != null) {
            driver.setAddress(request.getAddress());
        }
        if (request.getProfileImageUrl() != null) {
            driver.setProfileImageUrl(request.getProfileImageUrl());
        }
        if (request.getManualDispatchOnly() != null) {
            driver.setManualDispatchOnly(request.getManualDispatchOnly());
        }
        if (request.getIsVerified() != null) {
            driver.setIsVerified(request.getIsVerified());
        }
        if (request.getIsActive() != null) {
            driver.setIsActive(request.getIsActive());
        }
        if (request.getLicenseNumber() != null) {
            driver.setLicenseNumber(request.getLicenseNumber());
        }
        if (request.getLicenseExpiryDate() != null) {
            driver.setLicenseExpiryDate(request.getLicenseExpiryDate());
        }
        if (request.getLicenseImageUrl() != null) {
            driver.setLicenseImageUrl(request.getLicenseImageUrl());
        }
        if (request.getVehicleId() != null) {
            driver.setVehicleId(request.getVehicleId());
        }
        if (request.getUserId() != null) {
            driver.setUserId(request.getUserId());
        }
        if (request.getCompanyId() != null) {
            driver.setCompanyId(request.getCompanyId());
        }
        if (request.getAppVersion() != null) {
            driver.setAppVersion(request.getAppVersion());
        }
        if (request.getDeviceToken() != null) {
            driver.setDeviceToken(request.getDeviceToken());
        }

        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverDetailResponse getDriverById(Integer id) {
        Driver driver = findDriverOrThrow(id);
        return driverMapper.toDetailResponse(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverDetailResponse getDriverByCode(String code) {
        Driver driver = driverRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Driver not found with code: " + code));
        return driverMapper.toDetailResponse(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverDetailResponse getDriverByContactNumber(String contactNumber) {
        Driver driver = driverRepository.findByContactNumber(contactNumber)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Driver not found with contact number: " + contactNumber));
        return driverMapper.toDetailResponse(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getAllDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);

        // OLD: Page<Driver> driverPage = driverRepository.findAll(pageable);
        // NEW: Use the raw query to ensure no filters hide the data
        Page<Driver> driverPage = driverRepository.findAllDriversRaw(pageable);

        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getActiveDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findByIsActive(true, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getBlockedDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findByIsBlocked(true, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getVerifiedDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findByIsVerified(true, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getUnverifiedDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findByIsVerified(false, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getDriversByCompany(Integer companyId, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findByCompanyId(companyId, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> searchDrivers(String keyword, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.searchDrivers(keyword, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getDriversByFilters(Boolean isActive, Boolean isBlocked,
            Boolean isVerified, Integer companyId,
            Boolean manualDispatchOnly,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findByFilters(
                isActive, isBlocked, isVerified, companyId, manualDispatchOnly, pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getUnassignedDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findUnassignedDrivers(pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverResponse> getAvailableDrivers(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Driver> driverPage = driverRepository.findAvailableDrivers(pageable);
        return toPagedResponse(driverPage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getDriversByVehicleId(Integer vehicleId) {
        List<Driver> drivers = driverRepository.findByVehicleId(vehicleId);
        return driverMapper.toResponseList(drivers);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getDriversWithExpiredLicense() {
        List<Driver> drivers = driverRepository.findDriversWithExpiredLicense(LocalDate.now());
        return driverMapper.toResponseList(drivers);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getDriversWithExpiringLicense(int daysThreshold) {
        LocalDate threshold = LocalDate.now().plusDays(daysThreshold);
        List<Driver> drivers = driverRepository.findDriversWithExpiringLicense(LocalDate.now(), threshold);
        return driverMapper.toResponseList(drivers);
    }

    @Override
    public DriverResponse blockDriver(Integer id, DriverBlockRequest request) {
        Driver driver = findDriverOrThrow(id);
        driver.setIsBlocked(true);
        driver.setBlockedDescription(request.getBlockedDescription());
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse unblockDriver(Integer id) {
        Driver driver = findDriverOrThrow(id);
        driver.setIsBlocked(false);
        driver.setBlockedDescription(null);
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse verifyDriver(Integer id) {
        Driver driver = findDriverOrThrow(id);
        driver.setIsVerified(true);
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse activateDriver(Integer id) {
        Driver driver = findDriverOrThrow(id);
        driver.setIsActive(true);
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse deactivateDriver(Integer id) {
        Driver driver = findDriverOrThrow(id);
        driver.setIsActive(false);
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse assignVehicle(Integer id, Integer vehicleId) {
        Driver driver = findDriverOrThrow(id);
        driver.setVehicleId(vehicleId);
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse unassignVehicle(Integer id) {
        Driver driver = findDriverOrThrow(id);
        driver.setVehicleId(null);
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public DriverResponse updateLocation(Integer id, String location, String latitude, String longitude) {
        Driver driver = findDriverOrThrow(id);
        driver.setLastLocation(location);
        driver.setLastLocationTime(LocalDateTime.now());
        Driver updatedDriver = driverRepository.save(driver);
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public void deleteDriver(Integer id) {
        Driver driver = findDriverOrThrow(id);
        driverRepository.delete(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getDriverStatistics() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("totalDrivers", driverRepository.count());
        stats.put("activeDrivers", driverRepository.countByIsActive(true));
        stats.put("inactiveDrivers", driverRepository.countByIsActive(false));
        stats.put("blockedDrivers", driverRepository.countBlocked());
        stats.put("verifiedDrivers", driverRepository.countVerified());
        stats.put("unassignedDrivers", driverRepository.countUnassigned());

        Double avgRating = driverRepository.getOverallAverageRating();
        stats.put("overallAverageRatingX100",
                avgRating != null ? Math.round(avgRating * 100) : 0L);

        return stats;
    }

    // ======================== PRIVATE HELPERS ========================

    private Driver findDriverOrThrow(Integer id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Driver not found with id: " + id));
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<DriverResponse> toPagedResponse(Page<Driver> driverPage) {
        List<DriverResponse> content = driverPage.getContent().stream()
                .map(driverMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                driverPage.getNumber(),
                driverPage.getSize(),
                driverPage.getTotalElements(),
                driverPage.getTotalPages(),
                driverPage.isFirst(),
                driverPage.isLast(),
                driverPage.isEmpty());
    }
}