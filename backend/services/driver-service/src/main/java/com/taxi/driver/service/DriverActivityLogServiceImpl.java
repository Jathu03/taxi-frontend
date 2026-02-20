package com.taxi.driver.service;

import com.taxi.driver.dto.mapper.DriverActivityLogMapper;
import com.taxi.driver.dto.request.DriverActivityLogCreateRequest;
import com.taxi.driver.dto.response.DriverActivityLogResponse;
import com.taxi.driver.dto.response.PagedResponse;
import com.taxi.driver.entity.Driver;
import com.taxi.driver.entity.DriverActivityLog;
import com.taxi.driver.repository.DriverActivityLogRepository;
import com.taxi.driver.repository.DriverRepository;
import com.taxi.driver.service.DriverActivityLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverActivityLogServiceImpl implements DriverActivityLogService {

    private final DriverActivityLogRepository activityLogRepository;
    private final DriverRepository driverRepository;
    private final DriverActivityLogMapper activityLogMapper;

    public DriverActivityLogServiceImpl(DriverActivityLogRepository activityLogRepository,
            DriverRepository driverRepository,
            DriverActivityLogMapper activityLogMapper) {
        this.activityLogRepository = activityLogRepository;
        this.driverRepository = driverRepository;
        this.activityLogMapper = activityLogMapper;
    }

    @Override
    public DriverActivityLogResponse createActivityLog(DriverActivityLogCreateRequest request) {
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Driver not found with id: " + request.getDriverId()));

        DriverActivityLog activityLog = activityLogMapper.toEntity(request, driver);
        DriverActivityLog savedLog = activityLogRepository.save(activityLog);
        return activityLogMapper.toResponse(savedLog);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverActivityLogResponse getActivityLogById(Integer id) {
        DriverActivityLog activityLog = activityLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Driver activity log not found with id: " + id));
        return activityLogMapper.toResponse(activityLog);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByDriverId(Integer driverId, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByDriverId(driverId, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByDriverIdAndType(Integer driverId, String activityType,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByDriverIdAndActivityType(
                driverId, activityType, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByDriverIdAndDateRange(Integer driverId,
            LocalDate startDate,
            LocalDate endDate,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByDriverIdAndDateRange(
                driverId, startDate, endDate, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByDriverIdWithFilters(Integer driverId,
            String activityType,
            LocalDate logDate,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByDriverIdWithFilters(
                driverId, activityType, logDate, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByDateRange(LocalDate startDate, LocalDate endDate,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByDateRange(startDate, endDate, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByActivityType(String activityType, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByActivityType(activityType, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByDate(LocalDate logDate, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByLogDate(logDate, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DriverActivityLogResponse> getLogsByVehicleId(Integer vehicleId, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DriverActivityLog> logPage = activityLogRepository.findByVehicleId(vehicleId, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getActivityTypeCountsForDriver(Integer driverId) {
        List<Object[]> results = activityLogRepository.countByActivityTypeForDriver(driverId);
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getActivityTypeCountsForDateRange(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = activityLogRepository.countByActivityTypeForDateRange(startDate, endDate);
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalOnlineDurationForDriver(Integer driverId, LocalDate startDate, LocalDate endDate) {
        Long duration = activityLogRepository.getTotalOnlineDurationForDriver(driverId, startDate, endDate);
        return duration != null ? duration : 0L;
    }

    @Override
    @Transactional(readOnly = true)
    public long getLogCountForDriver(Integer driverId) {
        return activityLogRepository.countByDriverId(driverId);
    }

    // ======================== PRIVATE HELPERS ========================

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<DriverActivityLogResponse> toPagedResponse(Page<DriverActivityLog> logPage) {
        List<DriverActivityLogResponse> content = logPage.getContent().stream()
                .map(activityLogMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                logPage.getNumber(),
                logPage.getSize(),
                logPage.getTotalElements(),
                logPage.getTotalPages(),
                logPage.isFirst(),
                logPage.isLast(),
                logPage.isEmpty());
    }
}