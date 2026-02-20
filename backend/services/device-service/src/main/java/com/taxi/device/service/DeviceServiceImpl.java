package com.taxi.device.service;

import com.taxi.device.dto.mapper.DeviceMapper;
import com.taxi.device.dto.request.DeviceCreateRequest;
import com.taxi.device.dto.request.DeviceUpdateRequest;
import com.taxi.device.dto.response.DeviceDetailResponse;
import com.taxi.device.dto.response.DeviceResponse;
import com.taxi.device.dto.response.PagedResponse;
import com.taxi.device.entity.Device;
import com.taxi.device.entity.DeviceLog;
import com.taxi.device.repository.DeviceLogRepository;
import com.taxi.device.repository.DeviceRepository;
import com.taxi.device.service.DeviceService;
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
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceLogRepository deviceLogRepository;
    private final DeviceMapper deviceMapper;

    public DeviceServiceImpl(DeviceRepository deviceRepository,
            DeviceLogRepository deviceLogRepository,
            DeviceMapper deviceMapper) {
        this.deviceRepository = deviceRepository;
        this.deviceLogRepository = deviceLogRepository;
        this.deviceMapper = deviceMapper;
    }

    @Override
    public DeviceResponse createDevice(DeviceCreateRequest request) {
        if (deviceRepository.existsByDeviceId(request.getDeviceId())) {
            throw new IllegalArgumentException("Device with ID '" + request.getDeviceId() + "' already exists");
        }

        Device device = deviceMapper.toEntity(request);
        Device savedDevice = deviceRepository.save(device);

        createLog(savedDevice, "CREATED", null, savedDevice.getStatus(),
                null, savedDevice.getVehicleId(), null, savedDevice.getDriverId(),
                "Device created", null);

        return deviceMapper.toResponse(savedDevice);
    }

    @Override
    public DeviceResponse updateDevice(Integer id, DeviceUpdateRequest request) {
        Device device = findDeviceOrThrow(id);

        String oldStatus = device.getStatus();
        Integer oldVehicleId = device.getVehicleId();
        Integer oldDriverId = device.getDriverId();

        if (request.getDeviceType() != null) {
            device.setDeviceType(request.getDeviceType());
        }
        if (request.getDeviceModel() != null) {
            device.setDeviceModel(request.getDeviceModel());
        }
        if (request.getSerialNumber() != null) {
            device.setSerialNumber(request.getSerialNumber());
        }
        if (request.getSimNumber() != null) {
            device.setSimNumber(request.getSimNumber());
        }
        if (request.getSimProvider() != null) {
            device.setSimProvider(request.getSimProvider());
        }
        if (request.getVehicleId() != null) {
            device.setVehicleId(request.getVehicleId());
        }
        if (request.getDriverId() != null) {
            device.setDriverId(request.getDriverId());
        }
        if (request.getStatus() != null) {
            device.setStatus(request.getStatus());
        }
        if (request.getInstallDate() != null) {
            device.setInstallDate(request.getInstallDate());
        }
        if (request.getLastActive() != null) {
            device.setLastActive(request.getLastActive());
        }
        if (request.getGpsProvider() != null) {
            device.setGpsProvider(request.getGpsProvider());
        }
        if (request.getGpsAccountId() != null) {
            device.setGpsAccountId(request.getGpsAccountId());
        }
        if (request.getNotes() != null) {
            device.setNotes(request.getNotes());
        }

        Device updatedDevice = deviceRepository.save(device);

        String description = request.getChangeDescription() != null
                ? request.getChangeDescription()
                : "Device updated";

        createLog(updatedDevice, "UPDATED", oldStatus, updatedDevice.getStatus(),
                oldVehicleId, updatedDevice.getVehicleId(), oldDriverId, updatedDevice.getDriverId(),
                description, request.getLoggedBy());

        return deviceMapper.toResponse(updatedDevice);
    }

    @Override
    @Transactional(readOnly = true)
    public DeviceDetailResponse getDeviceById(Integer id) {
        Device device = findDeviceOrThrow(id);
        return deviceMapper.toDetailResponse(device);
    }

    @Override
    @Transactional(readOnly = true)
    public DeviceDetailResponse getDeviceByDeviceId(String deviceId) {
        Device device = deviceRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new EntityNotFoundException("Device not found with deviceId: " + deviceId));
        return deviceMapper.toDetailResponse(device);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceResponse> getAllDevices(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Device> devicePage = deviceRepository.findAll(pageable);
        return toPagedResponse(devicePage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceResponse> getDevicesByStatus(String status, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Device> devicePage = deviceRepository.findByStatus(status, pageable);
        return toPagedResponse(devicePage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceResponse> getDevicesByType(String deviceType, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Device> devicePage = deviceRepository.findByDeviceType(deviceType, pageable);
        return toPagedResponse(devicePage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceResponse> searchDevices(String keyword, int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Device> devicePage = deviceRepository.searchDevices(keyword, pageable);
        return toPagedResponse(devicePage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeviceResponse> getDevicesByFilters(String status, String deviceType,
            Integer vehicleId, Integer driverId,
            int page, int size,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Device> devicePage = deviceRepository.findByFilters(status, deviceType, vehicleId, driverId, pageable);
        return toPagedResponse(devicePage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponse> getDevicesByVehicleId(Integer vehicleId) {
        List<Device> devices = deviceRepository.findByVehicleId(vehicleId);
        return deviceMapper.toResponseList(devices);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponse> getDevicesByDriverId(Integer driverId) {
        List<Device> devices = deviceRepository.findByDriverId(driverId);
        return deviceMapper.toResponseList(devices);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponse> getUnassignedDevices() {
        List<Device> devices = deviceRepository.findUnassignedDevices();
        return deviceMapper.toResponseList(devices);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponse> getInactiveDevices(int hoursThreshold) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hoursThreshold);
        List<Device> devices = deviceRepository.findInactiveDevices(threshold);
        return deviceMapper.toResponseList(devices);
    }

    @Override
    public DeviceResponse updateDeviceStatus(Integer id, String newStatus, Integer loggedBy, String description) {
        Device device = findDeviceOrThrow(id);
        String oldStatus = device.getStatus();
        device.setStatus(newStatus);
        Device updatedDevice = deviceRepository.save(device);

        createLog(updatedDevice, "STATUS_CHANGE", oldStatus, newStatus,
                null, null, null, null,
                description != null ? description : "Status changed from " + oldStatus + " to " + newStatus,
                loggedBy);

        return deviceMapper.toResponse(updatedDevice);
    }

    @Override
    public DeviceResponse assignVehicle(Integer id, Integer vehicleId, Integer loggedBy, String description) {
        Device device = findDeviceOrThrow(id);
        Integer oldVehicleId = device.getVehicleId();
        device.setVehicleId(vehicleId);
        Device updatedDevice = deviceRepository.save(device);

        createLog(updatedDevice, "VEHICLE_ASSIGNED", null, null,
                oldVehicleId, vehicleId, null, null,
                description != null ? description : "Vehicle assigned: " + vehicleId,
                loggedBy);

        return deviceMapper.toResponse(updatedDevice);
    }

    @Override
    public DeviceResponse assignDriver(Integer id, Integer driverId, Integer loggedBy, String description) {
        Device device = findDeviceOrThrow(id);
        Integer oldDriverId = device.getDriverId();
        device.setDriverId(driverId);
        Device updatedDevice = deviceRepository.save(device);

        createLog(updatedDevice, "DRIVER_ASSIGNED", null, null,
                null, null, oldDriverId, driverId,
                description != null ? description : "Driver assigned: " + driverId,
                loggedBy);

        return deviceMapper.toResponse(updatedDevice);
    }

    @Override
    public DeviceResponse unassignVehicle(Integer id, Integer loggedBy, String description) {
        Device device = findDeviceOrThrow(id);
        Integer oldVehicleId = device.getVehicleId();
        device.setVehicleId(null);
        Device updatedDevice = deviceRepository.save(device);

        createLog(updatedDevice, "VEHICLE_UNASSIGNED", null, null,
                oldVehicleId, null, null, null,
                description != null ? description : "Vehicle unassigned (was: " + oldVehicleId + ")",
                loggedBy);

        return deviceMapper.toResponse(updatedDevice);
    }

    @Override
    public DeviceResponse unassignDriver(Integer id, Integer loggedBy, String description) {
        Device device = findDeviceOrThrow(id);
        Integer oldDriverId = device.getDriverId();
        device.setDriverId(null);
        Device updatedDevice = deviceRepository.save(device);

        createLog(updatedDevice, "DRIVER_UNASSIGNED", null, null,
                null, null, oldDriverId, null,
                description != null ? description : "Driver unassigned (was: " + oldDriverId + ")",
                loggedBy);

        return deviceMapper.toResponse(updatedDevice);
    }

    @Override
    public void deleteDevice(Integer id) {
        Device device = findDeviceOrThrow(id);
        deviceRepository.delete(device);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getDeviceStatusCounts() {
        List<Object[]> results = deviceRepository.countByStatusGrouped();
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getDeviceTypeCounts() {
        List<Object[]> results = deviceRepository.countByDeviceType();
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

    // ======================== PRIVATE HELPERS ========================

    private Device findDeviceOrThrow(Integer id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Device not found with id: " + id));
    }

    private void createLog(Device device, String logType, String oldStatus, String newStatus,
            Integer oldVehicleId, Integer newVehicleId,
            Integer oldDriverId, Integer newDriverId,
            String description, Integer loggedBy) {
        DeviceLog log = DeviceLog.builder()
                .device(device)
                .logType(logType)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .oldVehicleId(oldVehicleId)
                .newVehicleId(newVehicleId)
                .oldDriverId(oldDriverId)
                .newDriverId(newDriverId)
                .description(description)
                .loggedBy(loggedBy)
                .build();
        deviceLogRepository.save(log);
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PagedResponse<DeviceResponse> toPagedResponse(Page<Device> devicePage) {
        List<DeviceResponse> content = devicePage.getContent().stream()
                .map(deviceMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                devicePage.getNumber(),
                devicePage.getSize(),
                devicePage.getTotalElements(),
                devicePage.getTotalPages(),
                devicePage.isFirst(),
                devicePage.isLast(),
                devicePage.isEmpty());
    }
}