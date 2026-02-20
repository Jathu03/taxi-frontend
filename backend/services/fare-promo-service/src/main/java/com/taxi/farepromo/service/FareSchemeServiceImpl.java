package com.taxi.farepromo.service;

import com.taxi.farepromo.dto.request.FareSchemeCreateRequest;
import com.taxi.farepromo.dto.request.FareSchemeUpdateRequest;
import com.taxi.farepromo.dto.response.FareSchemeResponse;
import com.taxi.farepromo.entity.FareScheme;
import com.taxi.farepromo.repository.FareSchemeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FareSchemeServiceImpl implements FareSchemeService {

    private final FareSchemeRepository fareSchemeRepository;

    @Override
    public FareSchemeResponse createFareScheme(FareSchemeCreateRequest request) {
        log.info("Creating fare scheme: {}", request.getFareCode());

        if (fareSchemeRepository.existsByFareCode(request.getFareCode())) {
            throw new IllegalArgumentException("Fare code already exists: " + request.getFareCode());
        }

        FareScheme fareScheme = FareScheme.builder()
                .fareCode(request.getFareCode())
                .fareName(request.getFareName())
                .description(request.getDescription())
                .vehicleClassId(request.getVehicleClassId())
                .isMetered(request.getIsMetered())
                .isPackage(request.getIsPackage())
                .minimumDistance(request.getMinimumDistance())
                .minimumRate(request.getMinimumRate())
                .ratePerKm(request.getRatePerKm())
                .freeWaitTime(request.getFreeWaitTime())
                .waitingChargePerMin(request.getWaitingChargePerMin())
                .peakHourStartTime(parseTime(request.getPeakHourStartTime()))
                .peakHourEndTime(parseTime(request.getPeakHourEndTime()))
                .peakHourRateHike(request.getPeakHourRateHike())
                .offPeakMinRateHike(request.getOffPeakMinRateHike())
                .ratePerKmHike(request.getRatePerKmHike())
                .minimumTime(request.getMinimumTime())
                .additionalTimeSlot(request.getAdditionalTimeSlot())
                .ratePerAdditionalTimeSlot(request.getRatePerAdditionalTimeSlot())
                .nightStartTime(parseTime(request.getNightStartTime()))
                .nightEndTime(parseTime(request.getNightEndTime()))
                .nightRateHike(request.getNightRateHike())
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .build();

        FareScheme saved = fareSchemeRepository.save(fareScheme);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FareSchemeResponse getFareSchemeById(Integer id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public FareSchemeResponse getFareSchemeByCode(String fareCode) {
        FareScheme fareScheme = fareSchemeRepository.findByFareCode(fareCode)
                .orElseThrow(() -> new EntityNotFoundException("Fare scheme not found with code: " + fareCode));
        return mapToResponse(fareScheme);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FareSchemeResponse> getAllFareSchemes(Pageable pageable) {
        return fareSchemeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FareSchemeResponse> searchFareSchemes(String search, String status, Pageable pageable) {
        if (status != null) {
            return fareSchemeRepository.searchFareSchemesWithFilter(search, status, pageable)
                    .map(this::mapToResponse);
        }
        return fareSchemeRepository.searchFareSchemes(search, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FareSchemeResponse> getActiveFareSchemes() {
        return fareSchemeRepository.findByStatus("Active")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FareSchemeResponse> getFareSchemesByVehicleClass(Integer vehicleClassId) {
        return fareSchemeRepository.findActiveFareSchemesByVehicleClass(vehicleClassId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public FareSchemeResponse updateFareScheme(Integer id, FareSchemeUpdateRequest request) {
        FareScheme fareScheme = findOrThrow(id);

        if (request.getFareCode() != null &&
                !request.getFareCode().equals(fareScheme.getFareCode()) &&
                fareSchemeRepository.existsByFareCode(request.getFareCode())) {
            throw new IllegalArgumentException("Fare code already exists: " + request.getFareCode());
        }

        if (request.getFareCode() != null)
            fareScheme.setFareCode(request.getFareCode());
        if (request.getFareName() != null)
            fareScheme.setFareName(request.getFareName());
        if (request.getDescription() != null)
            fareScheme.setDescription(request.getDescription());
        if (request.getVehicleClassId() != null)
            fareScheme.setVehicleClassId(request.getVehicleClassId());
        if (request.getIsMetered() != null)
            fareScheme.setIsMetered(request.getIsMetered());
        if (request.getIsPackage() != null)
            fareScheme.setIsPackage(request.getIsPackage());
        if (request.getMinimumDistance() != null)
            fareScheme.setMinimumDistance(request.getMinimumDistance());
        if (request.getMinimumRate() != null)
            fareScheme.setMinimumRate(request.getMinimumRate());
        if (request.getRatePerKm() != null)
            fareScheme.setRatePerKm(request.getRatePerKm());
        if (request.getFreeWaitTime() != null)
            fareScheme.setFreeWaitTime(request.getFreeWaitTime());
        if (request.getWaitingChargePerMin() != null)
            fareScheme.setWaitingChargePerMin(request.getWaitingChargePerMin());
        if (request.getPeakHourStartTime() != null)
            fareScheme.setPeakHourStartTime(parseTime(request.getPeakHourStartTime()));
        if (request.getPeakHourEndTime() != null)
            fareScheme.setPeakHourEndTime(parseTime(request.getPeakHourEndTime()));
        if (request.getPeakHourRateHike() != null)
            fareScheme.setPeakHourRateHike(request.getPeakHourRateHike());
        if (request.getOffPeakMinRateHike() != null)
            fareScheme.setOffPeakMinRateHike(request.getOffPeakMinRateHike());
        if (request.getRatePerKmHike() != null)
            fareScheme.setRatePerKmHike(request.getRatePerKmHike());
        if (request.getMinimumTime() != null)
            fareScheme.setMinimumTime(request.getMinimumTime());
        if (request.getAdditionalTimeSlot() != null)
            fareScheme.setAdditionalTimeSlot(request.getAdditionalTimeSlot());
        if (request.getRatePerAdditionalTimeSlot() != null)
            fareScheme.setRatePerAdditionalTimeSlot(request.getRatePerAdditionalTimeSlot());
        if (request.getNightStartTime() != null)
            fareScheme.setNightStartTime(parseTime(request.getNightStartTime()));
        if (request.getNightEndTime() != null)
            fareScheme.setNightEndTime(parseTime(request.getNightEndTime()));
        if (request.getNightRateHike() != null)
            fareScheme.setNightRateHike(request.getNightRateHike());
        if (request.getStatus() != null)
            fareScheme.setStatus(request.getStatus());

        return mapToResponse(fareSchemeRepository.save(fareScheme));
    }

    @Override
    public void deleteFareScheme(Integer id) {
        FareScheme fareScheme = findOrThrow(id);
        fareSchemeRepository.delete(fareScheme);
    }

    @Override
    public FareSchemeResponse toggleFareSchemeStatus(Integer id) {
        FareScheme fareScheme = findOrThrow(id);
        fareScheme.setStatus("Active".equals(fareScheme.getStatus()) ? "Inactive" : "Active");
        return mapToResponse(fareSchemeRepository.save(fareScheme));
    }

    // ========== Helpers ==========

    private FareScheme findOrThrow(Integer id) {
        return fareSchemeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fare scheme not found with id: " + id));
    }

    private LocalTime parseTime(String time) {
        if (time == null || time.isBlank())
            return null;
        return LocalTime.parse(time);
    }

    private FareSchemeResponse mapToResponse(FareScheme fs) {
        return FareSchemeResponse.builder()
                .id(fs.getId())
                .fareCode(fs.getFareCode())
                .fareName(fs.getFareName())
                .description(fs.getDescription())
                .vehicleClassId(fs.getVehicleClassId())
                .isMetered(fs.getIsMetered())
                .isPackage(fs.getIsPackage())
                .minimumDistance(fs.getMinimumDistance())
                .minimumRate(fs.getMinimumRate())
                .ratePerKm(fs.getRatePerKm())
                .freeWaitTime(fs.getFreeWaitTime())
                .waitingChargePerMin(fs.getWaitingChargePerMin())
                .peakHourStartTime(fs.getPeakHourStartTime())
                .peakHourEndTime(fs.getPeakHourEndTime())
                .peakHourRateHike(fs.getPeakHourRateHike())
                .offPeakMinRateHike(fs.getOffPeakMinRateHike())
                .ratePerKmHike(fs.getRatePerKmHike())
                .minimumTime(fs.getMinimumTime())
                .additionalTimeSlot(fs.getAdditionalTimeSlot())
                .ratePerAdditionalTimeSlot(fs.getRatePerAdditionalTimeSlot())
                .nightStartTime(fs.getNightStartTime())
                .nightEndTime(fs.getNightEndTime())
                .nightRateHike(fs.getNightRateHike())
                .status(fs.getStatus())
                .createdAt(fs.getCreatedAt())
                .updatedAt(fs.getUpdatedAt())
                .build();
    }
}