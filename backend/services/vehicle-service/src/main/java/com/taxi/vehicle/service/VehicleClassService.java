package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleClassRequest;
import com.taxi.vehicle.dto.response.VehicleClassResponse;
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

    @Transactional(readOnly = true)
    public VehicleClassResponse getClassById(Integer id) {
        VehicleClass vClass = classRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Vehicle class not found with id: " + id));
        return mapToResponse(vClass);
    }

    @Transactional
    public VehicleClassResponse updateClass(Integer id, VehicleClassRequest request) {
        VehicleClass existing = classRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle class not found with id: " + id));

        VehicleCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        }

        existing.setClassName(request.getClassName());
        existing.setClassCode(request.getClassCode());
        existing.setVehicleCategory(category);
        existing.setCommissionRate(request.getCommissionRate());
        existing.setLuggageCapacity(request.getLuggageCapacity());
        existing.setNoOfSeats(request.getNoOfSeats());
        existing.setDescription(request.getDescription());
        existing.setShowInApp(request.getShowInApp() != null ? request.getShowInApp() : existing.getShowInApp());
        existing.setShowInWeb(request.getShowInWeb() != null ? request.getShowInWeb() : existing.getShowInWeb());
        existing.setAppOrder(request.getAppOrder());
        existing.setImageUrl(request.getImageUrl());

        return mapToResponse(classRepository.save(existing));
    }

    @Transactional
    public void deleteClass(Integer id) {
        if (!classRepository.existsById(id)) {
            throw new EntityNotFoundException("Vehicle class not found with id: " + id);
        }
        classRepository.deleteById(id);
    }

    /**
     * Toggle active/visible status of a Vehicle Class.
     * Here we treat 'showInApp' as the active flag for simplicity.
     */
    @Transactional
    public VehicleClassResponse toggleActive(Integer id) {
        VehicleClass existing = classRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle class not found with id: " + id));

        Boolean current = existing.getShowInApp();
        boolean newValue = current == null ? true : !current;
        existing.setShowInApp(newValue);

        // If you also want to reflect it on the web:
        // existing.setShowInWeb(newValue);

        classRepository.save(existing);
        return mapToResponse(existing);
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