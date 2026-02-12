package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.response.VehicleClassResponse;
import com.taxi.vehicle.dto.request.VehicleClassRequest;
import com.taxi.vehicle.entity.VehicleClass;
import com.taxi.vehicle.entity.VehicleCategory;
import com.taxi.vehicle.repository.VehicleClassRepository;
import com.taxi.vehicle.repository.VehicleCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleClassService {

    private final VehicleClassRepository classRepository;
    private final VehicleCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<VehicleClassResponse> getAllActiveClasses() {
        return classRepository.findByShowInAppTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleClassResponse> getAllClasses() {
        return classRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleClassResponse createClass(VehicleClassRequest request) {
        VehicleCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        }

        VehicleClass vClass = VehicleClass.builder()
                .className(request.getClassName())
                .classCode(request.getClassCode())
                .vehicleCategory(category)
                .commissionRate(request.getCommissionRate())
                .luggageCapacity(request.getLuggageCapacity())
                .noOfSeats(request.getNoOfSeats())
                .description(request.getDescription())
                .showInApp(request.getShowInApp() != null ? request.getShowInApp() : true)
                .showInWeb(request.getShowInWeb() != null ? request.getShowInWeb() : true)
                .appOrder(request.getAppOrder())
                .imageUrl(request.getImageUrl())
                .build();

        return mapToResponse(classRepository.save(vClass));
    }

    private VehicleClassResponse mapToResponse(VehicleClass v) {
        return VehicleClassResponse.builder()
                .id(v.getId())
                .className(v.getClassName())
                .classCode(v.getClassCode())
                .categoryName(v.getVehicleCategory() != null ? v.getVehicleCategory().getCategoryName() : null)
                .commissionRate(v.getCommissionRate())
                .luggageCapacity(v.getLuggageCapacity())
                .noOfSeats(v.getNoOfSeats())
                .description(v.getDescription())
                .showInApp(v.getShowInApp())
                .showInWeb(v.getShowInWeb())
                .appOrder(v.getAppOrder())
                .imageUrl(v.getImageUrl())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }
}