package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleMakeCreateRequest;
import com.taxi.vehicle.dto.request.VehicleMakeUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleMakeResponse;
import com.taxi.vehicle.entity.VehicleMake;
import com.taxi.vehicle.repository.VehicleMakeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VehicleMakeServiceImpl implements VehicleMakeService {

    private final VehicleMakeRepository makeRepository;

    @Override
    public VehicleMakeResponse createMake(VehicleMakeCreateRequest request) {
        log.info("Creating vehicle make: {}", request.getManufacturer());

        if (makeRepository.existsByManufacturer(request.getManufacturer())) {
            throw new IllegalArgumentException(
                    "Manufacturer already exists: " + request.getManufacturer());
        }

        if (request.getManufacturerCode() != null &&
                makeRepository.existsByManufacturerCode(request.getManufacturerCode())) {
            throw new IllegalArgumentException(
                    "Manufacturer code already exists: " + request.getManufacturerCode());
        }

        VehicleMake make = VehicleMake.builder()
                .manufacturer(request.getManufacturer())
                .manufacturerCode(request.getManufacturerCode())
                .build();

        VehicleMake saved = makeRepository.save(make);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleMakeResponse getMakeById(Integer id) {
        VehicleMake make = findMakeOrThrow(id);
        return mapToResponse(make);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleMakeResponse> getAllMakes(Pageable pageable) {
        return makeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleMakeResponse> searchMakes(String search, Pageable pageable) {
        return makeRepository.searchMakes(search, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleMakeResponse> getAllMakesList() {
        return makeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleMakeResponse updateMake(Integer id, VehicleMakeUpdateRequest request) {
        VehicleMake make = findMakeOrThrow(id);

        if (request.getManufacturer() != null &&
                !request.getManufacturer().equals(make.getManufacturer()) &&
                makeRepository.existsByManufacturer(request.getManufacturer())) {
            throw new IllegalArgumentException(
                    "Manufacturer already exists: " + request.getManufacturer());
        }

        if (request.getManufacturerCode() != null &&
                !request.getManufacturerCode().equals(make.getManufacturerCode()) &&
                makeRepository.existsByManufacturerCode(request.getManufacturerCode())) {
            throw new IllegalArgumentException(
                    "Manufacturer code already exists: " + request.getManufacturerCode());
        }

        if (request.getManufacturer() != null) {
            make.setManufacturer(request.getManufacturer());
        }
        if (request.getManufacturerCode() != null) {
            make.setManufacturerCode(request.getManufacturerCode());
        }

        VehicleMake updated = makeRepository.save(make);
        return mapToResponse(updated);
    }

    @Override
    public void deleteMake(Integer id) {
        VehicleMake make = findMakeOrThrow(id);
        makeRepository.delete(make);
    }

    private VehicleMake findMakeOrThrow(Integer id) {
        return makeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Vehicle make not found with id: " + id));
    }

    private VehicleMakeResponse mapToResponse(VehicleMake make) {
        return VehicleMakeResponse.builder()
                .id(make.getId())
                .manufacturer(make.getManufacturer())
                .manufacturerCode(make.getManufacturerCode())
                .modelCount(make.getModels() != null ? make.getModels().size() : 0)
                .createdAt(make.getCreatedAt())
                .updatedAt(make.getUpdatedAt())
                .build();
    }
}