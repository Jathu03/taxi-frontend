package com.taxi.device.service;

import com.taxi.device.dto.mapper.DeviceLogMapper;
import com.taxi.device.dto.request.DeviceLogCreateRequest;
import com.taxi.device.dto.response.DeviceLogResponse;
import com.taxi.device.dto.response.PagedResponse;
import com.taxi.device.entity.Device;
import com.taxi.device.entity.DeviceLog;
import com.taxi.device.repository.DeviceLogRepository;
import com.taxi.device.repository.DeviceRepository;
import com.taxi.device.service.DeviceLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeviceLogServiceImpl implements DeviceLogService {

    private final DeviceLogRepository deviceLogRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceLogMapper deviceLogMapper;

    public DeviceLogServiceImpl(DeviceLogRepository deviceLogRepository,
            DeviceRepository deviceRepository,
            DeviceLogMapper deviceLogMapper) {
        this.deviceLogRepository = deviceLogRepository;
        this.deviceRepository = deviceRepository;
        this.deviceLogMapper = deviceLogMapper;
    }

    @Override
    public DeviceLogResponse createDeviceLog(DeviceLogCreateRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new EntityNotFoundException("Device not found with id: " + request.getDeviceId()));

        DeviceLog deviceLog = deviceLogMapper.toEntity(request, device);
        DeviceLog savedLog = deviceLogRepository.save(deviceLog);
        return deviceLogMapper.toResponse(savedLog);
    }

    @Override
    @Transactional(readOnly = true)
    public DeviceLogResponse getDeviceLogById(Integer id) {
        DeviceLog deviceLog = deviceLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Device log not found with id: " + id));
        return deviceLogMapper.toResponse(deviceLog);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceLogResponse> getLogsByDeviceId(Integer deviceId, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DeviceLog> logPage = deviceLogRepository.findByDeviceId(deviceId, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceLogResponse> getLogsByDeviceIdAndType(Integer deviceId, String logType,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DeviceLog> logPage = deviceLogRepository.findByDeviceIdAndLogType(deviceId, logType, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceLogResponse> getLogsByDeviceIdAndDateRange(Integer deviceId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DeviceLog> logPage = deviceLogRepository.findByDeviceIdAndDateRange(deviceId, startDate, endDate,
                pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceLogResponse> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DeviceLog> logPage = deviceLogRepository.findByDateRange(startDate, endDate, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceLogResponse> getLogsByLogType(String logType, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DeviceLog> logPage = deviceLogRepository.findByLogType(logType, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceLogResponse> getLogsByUser(Integer loggedBy, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<DeviceLog> logPage = deviceLogRepository.findByLoggedBy(loggedBy, pageable);
        return toPagedResponse(logPage);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getLogTypeCountsForDevice(Integer deviceId) {
        List<Object[]> results = deviceLogRepository.countLogsByTypeForDevice(deviceId);
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public long getLogCountForDevice(Integer deviceId) {
        return deviceLogRepository.countByDeviceId(deviceId);
    }

    // ======================== PRIVATE HELPERS ========================

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<DeviceLogResponse> toPagedResponse(Page<DeviceLog> logPage) {
        List<DeviceLogResponse> content = logPage.getContent().stream()
                .map(deviceLogMapper::toResponse)
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