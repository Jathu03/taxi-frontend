package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.CreateVehicleOwnerRequest;
import com.taxi.vehicle.dto.request.VehicleOwnerUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleOwnerResponse;
import com.taxi.vehicle.entity.VehicleOwner;
import com.taxi.vehicle.repository.VehicleOwnerRepository;
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
public class VehicleOwnerServiceImpl implements VehicleOwnerService {

    private final VehicleOwnerRepository vehicleOwnerRepository;

    @Override
    public VehicleOwnerResponse createOwner(CreateVehicleOwnerRequest request) {
        log.info("Creating vehicle owner with name: {}", request.getName());

        VehicleOwner owner = VehicleOwner.builder()
                .name(request.getName())
                .nicOrBusinessReg(request.getNicOrBusinessReg())
                .company(request.getCompany())
                .email(request.getEmail())
                .primaryContact(request.getPrimaryContact())
                .secondaryContact(request.getSecondaryContact())
                .postalAddress(request.getPostalAddress())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        VehicleOwner savedOwner = vehicleOwnerRepository.save(owner);
        return mapToResponse(savedOwner);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleOwnerResponse getOwnerById(Integer id) {
        VehicleOwner owner = findOwnerOrThrow(id);
        return mapToResponse(owner);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleOwnerResponse> getAllOwners(Pageable pageable) {
        return vehicleOwnerRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleOwnerResponse> getAllActiveOwners() {
        return vehicleOwnerRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleOwnerResponse> searchOwners(String search, Boolean isActive, Pageable pageable) {
        if (isActive != null) {
            return vehicleOwnerRepository.searchOwnersWithFilter(search, isActive, pageable)
                    .map(this::mapToResponse);
        }
        return vehicleOwnerRepository.searchOwners(search, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleOwnerResponse> getOwnersByContact(String primaryContact) {
        return vehicleOwnerRepository.findByPrimaryContact(primaryContact)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleOwnerResponse updateOwner(Integer id, VehicleOwnerUpdateRequest request) {
        VehicleOwner owner = findOwnerOrThrow(id);

        if (request.getName() != null) {
            owner.setName(request.getName());
        }
        if (request.getNicOrBusinessReg() != null) {
            owner.setNicOrBusinessReg(request.getNicOrBusinessReg());
        }
        if (request.getCompany() != null) {
            owner.setCompany(request.getCompany());
        }
        if (request.getEmail() != null) {
            owner.setEmail(request.getEmail());
        }
        if (request.getPrimaryContact() != null) {
            owner.setPrimaryContact(request.getPrimaryContact());
        }
        if (request.getSecondaryContact() != null) {
            owner.setSecondaryContact(request.getSecondaryContact());
        }
        if (request.getPostalAddress() != null) {
            owner.setPostalAddress(request.getPostalAddress());
        }
        if (request.getIsActive() != null) {
            owner.setIsActive(request.getIsActive());
        }

        VehicleOwner updatedOwner = vehicleOwnerRepository.save(owner);
        return mapToResponse(updatedOwner);
    }

    @Override
    public void deleteOwner(Integer id) {
        VehicleOwner owner = findOwnerOrThrow(id);
        vehicleOwnerRepository.delete(owner);
    }

    @Override
    public VehicleOwnerResponse toggleOwnerStatus(Integer id) {
        VehicleOwner owner = findOwnerOrThrow(id);
        owner.setIsActive(!owner.getIsActive());
        VehicleOwner updatedOwner = vehicleOwnerRepository.save(owner);
        return mapToResponse(updatedOwner);
    }

    private VehicleOwner findOwnerOrThrow(Integer id) {
        return vehicleOwnerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Vehicle owner not found with id: " + id));
    }

    private VehicleOwnerResponse mapToResponse(VehicleOwner owner) {
        return VehicleOwnerResponse.builder()
                .id(owner.getId())
                .name(owner.getName())
                .nicOrBusinessReg(owner.getNicOrBusinessReg())
                .company(owner.getCompany())
                .email(owner.getEmail())
                .primaryContact(owner.getPrimaryContact())
                .secondaryContact(owner.getSecondaryContact())
                .postalAddress(owner.getPostalAddress())
                .isActive(owner.getIsActive())
                .createdAt(owner.getCreatedAt())
                .updatedAt(owner.getUpdatedAt())
                .build();
    }
}