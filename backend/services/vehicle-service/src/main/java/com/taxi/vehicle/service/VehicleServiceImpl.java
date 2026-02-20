package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleCreateRequest;
import com.taxi.vehicle.dto.request.VehicleUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleResponse;
import com.taxi.vehicle.entity.*;
import com.taxi.vehicle.enums.FuelType;
import com.taxi.vehicle.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMakeRepository makeRepository;
    private final VehicleModelRepository modelRepository;
    private final InsurerRepository insurerRepository;
    private final VehicleOwnerRepository ownerRepository;
    private final VehicleClassRepository classRepository;
    private final CompanyRepository companyRepository;

    @Override
    public VehicleResponse createVehicle(VehicleCreateRequest request) {
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new IllegalArgumentException("Registration number already exists");
        }
        if (vehicleRepository.existsByVehicleCode(request.getVehicleCode())) {
            throw new IllegalArgumentException("Vehicle code already exists");
        }

        Vehicle vehicle = new Vehicle();
        mapRequestToEntity(request, vehicle);

        // Manual Status set for create
        vehicle.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        return mapToResponse(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleResponse getVehicleById(Integer id) {
        return mapToResponse(vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found")));
    }

    @Override
    public Page<VehicleResponse> searchVehicles(String search, Boolean isActive, Pageable pageable) {
        return vehicleRepository.searchVehicles(search, isActive, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public VehicleResponse updateVehicle(Integer id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        // Validation 1: Check duplicate reg number if changed
        if (request.getRegistrationNumber() != null &&
                !request.getRegistrationNumber().equals(vehicle.getRegistrationNumber()) &&
                vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new IllegalArgumentException("Registration number already exists");
        }

        // Validation 2: Check duplicate Vehicle Code if changed
        if (request.getVehicleCode() != null &&
                !request.getVehicleCode().equals(vehicle.getVehicleCode()) &&
                vehicleRepository.existsByVehicleCode(request.getVehicleCode())) {
            throw new IllegalArgumentException("Vehicle code already exists");
        }

        mapUpdateRequestToEntity(request, vehicle);

        return mapToResponse(vehicleRepository.save(vehicle));
    }

    // --- FIX IS HERE: SOFT DELETE IMPLEMENTATION ---
    @Override
    public void deleteVehicle(Integer id) {
        // 1. Find the vehicle (Throw error if not found)
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + id));

        // 2. Mark as Inactive (Soft Delete)
        // This prevents the "Foreign Key Constraint" error
        vehicle.setIsActive(false);

        // 3. Save changes
        vehicleRepository.save(vehicle);
    }

    // --- Helper Methods ---

    // MAPPING FOR CREATE REQUEST
    private void mapRequestToEntity(VehicleCreateRequest request, Vehicle vehicle) {
        if (request.getVehicleCode() != null)
            vehicle.setVehicleCode(request.getVehicleCode());
        if (request.getRegistrationNumber() != null)
            vehicle.setRegistrationNumber(request.getRegistrationNumber());
        if (request.getChassisNumber() != null)
            vehicle.setChassisNumber(request.getChassisNumber());
        if (request.getRegistrationDate() != null)
            vehicle.setRegistrationDate(request.getRegistrationDate());
        if (request.getRevenueLicenseNumber() != null)
            vehicle.setRevenueLicenseNumber(request.getRevenueLicenseNumber());
        if (request.getRevenueLicenseExpiryDate() != null)
            vehicle.setRevenueLicenseExpiryDate(request.getRevenueLicenseExpiryDate());
        if (request.getPassengerCapacity() != null)
            vehicle.setPassengerCapacity(request.getPassengerCapacity());
        if (request.getLuggageCapacity() != null)
            vehicle.setLuggageCapacity(request.getLuggageCapacity());
        if (request.getComments() != null)
            vehicle.setComments(request.getComments());
        if (request.getManufactureYear() != null)
            vehicle.setManufactureYear(request.getManufactureYear());

        if (request.getFuelType() != null)
            vehicle.setFuelType(FuelType.fromString(request.getFuelType()));

        if (request.getInsuranceNumber() != null)
            vehicle.setInsuranceNumber(request.getInsuranceNumber());
        if (request.getInsuranceExpiryDate() != null)
            vehicle.setInsuranceExpiryDate(request.getInsuranceExpiryDate());
        if (request.getIsActive() != null)
            vehicle.setIsActive(request.getIsActive());

        linkForeignEntities(vehicle, request.getMakeId(), request.getModelId(), request.getInsurerId(),
                request.getOwnerId(), request.getClassId(), request.getCompanyId(), request.getFareSchemeId());
    }

    // MAPPING FOR UPDATE REQUEST
    private void mapUpdateRequestToEntity(VehicleUpdateRequest request, Vehicle vehicle) {
        if (request.getVehicleCode() != null)
            vehicle.setVehicleCode(request.getVehicleCode());
        if (request.getRegistrationNumber() != null)
            vehicle.setRegistrationNumber(request.getRegistrationNumber());
        if (request.getChassisNumber() != null)
            vehicle.setChassisNumber(request.getChassisNumber());
        if (request.getRegistrationDate() != null)
            vehicle.setRegistrationDate(request.getRegistrationDate());
        if (request.getRevenueLicenseNumber() != null)
            vehicle.setRevenueLicenseNumber(request.getRevenueLicenseNumber());
        if (request.getRevenueLicenseExpiryDate() != null)
            vehicle.setRevenueLicenseExpiryDate(request.getRevenueLicenseExpiryDate());
        if (request.getPassengerCapacity() != null)
            vehicle.setPassengerCapacity(request.getPassengerCapacity());
        if (request.getLuggageCapacity() != null)
            vehicle.setLuggageCapacity(request.getLuggageCapacity());
        if (request.getComments() != null)
            vehicle.setComments(request.getComments());
        if (request.getManufactureYear() != null)
            vehicle.setManufactureYear(request.getManufactureYear());

        if (request.getFuelType() != null)
            vehicle.setFuelType(FuelType.fromString(request.getFuelType()));

        if (request.getInsuranceNumber() != null)
            vehicle.setInsuranceNumber(request.getInsuranceNumber());
        if (request.getInsuranceExpiryDate() != null)
            vehicle.setInsuranceExpiryDate(request.getInsuranceExpiryDate());
        if (request.getIsActive() != null)
            vehicle.setIsActive(request.getIsActive());

        linkForeignEntities(vehicle, request.getMakeId(), request.getModelId(), request.getInsurerId(),
                request.getOwnerId(), request.getClassId(), request.getCompanyId(), request.getFareSchemeId());
    }

    // SHARED LOGIC TO LINK ENTITIES
    private void linkForeignEntities(Vehicle vehicle, Integer makeId, Integer modelId, Integer insurerId,
            Integer ownerId, Integer classId, Integer companyId, Integer fareSchemeId) {
        if (makeId != null) {
            vehicle.setMake(makeRepository.findById(makeId)
                    .orElseThrow(() -> new EntityNotFoundException("Make not found")));
        }
        if (modelId != null) {
            vehicle.setModel(modelRepository.findById(modelId)
                    .orElseThrow(() -> new EntityNotFoundException("Model not found")));
        }
        if (insurerId != null) {
            vehicle.setInsurer(insurerRepository.findById(insurerId)
                    .orElseThrow(() -> new EntityNotFoundException("Insurer not found")));
        }
        if (ownerId != null) {
            vehicle.setOwner(ownerRepository.findById(ownerId)
                    .orElseThrow(() -> new EntityNotFoundException("Owner not found")));
        }
        if (classId != null) {
            vehicle.setVehicleClass(classRepository.findById(classId)
                    .orElseThrow(() -> new EntityNotFoundException("Class not found")));
        }
        if (companyId != null) {
            vehicle.setCompany(companyRepository.findById(companyId)
                    .orElseThrow(() -> new EntityNotFoundException("Company not found")));
        }
        if (fareSchemeId != null) {
            vehicle.setFareSchemeId(fareSchemeId);
        }
    }

    private VehicleResponse mapToResponse(Vehicle v) {
        return VehicleResponse.builder()
                .id(v.getId())
                .vehicleCode(v.getVehicleCode())
                .registrationNumber(v.getRegistrationNumber())
                .chassisNumber(v.getChassisNumber())
                .registrationDate(v.getRegistrationDate())
                .revenueLicenseNumber(v.getRevenueLicenseNumber())
                .revenueLicenseExpiryDate(v.getRevenueLicenseExpiryDate())
                .passengerCapacity(v.getPassengerCapacity())
                .luggageCapacity(v.getLuggageCapacity())
                .comments(v.getComments())
                .manufactureYear(v.getManufactureYear())
                .fuelType(v.getFuelType() != null ? v.getFuelType().name() : null)
                .insuranceNumber(v.getInsuranceNumber())
                .insuranceExpiryDate(v.getInsuranceExpiryDate())
                .isActive(v.getIsActive())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                // Relation Names
                .makeId(v.getMake() != null ? v.getMake().getId() : null)
                .makeName(v.getMake() != null ? v.getMake().getManufacturer() : null)
                .modelId(v.getModel() != null ? v.getModel().getId() : null)
                .modelName(v.getModel() != null ? v.getModel().getModel() : null)
                .insurerId(v.getInsurer() != null ? v.getInsurer().getId() : null)
                .insurerName(v.getInsurer() != null ? v.getInsurer().getInsurerName() : null)
                .ownerId(v.getOwner() != null ? v.getOwner().getId() : null)
                .ownerName(v.getOwner() != null ? v.getOwner().getName() : null)
                .classId(v.getVehicleClass() != null ? v.getVehicleClass().getId() : null)
                .className(v.getVehicleClass() != null ? v.getVehicleClass().getClassName() : null)
                .companyId(v.getCompany() != null ? v.getCompany().getId() : null)
                .companyName(v.getCompany() != null ? v.getCompany().getCompanyName() : null)
                .fareSchemeId(v.getFareSchemeId())
                .build();
    }
}