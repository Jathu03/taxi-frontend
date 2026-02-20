package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.CreateVehicleOwnerRequest;
import com.taxi.vehicle.dto.request.VehicleOwnerUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleOwnerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VehicleOwnerService {

    VehicleOwnerResponse createOwner(CreateVehicleOwnerRequest request);

    VehicleOwnerResponse getOwnerById(Integer id);

    Page<VehicleOwnerResponse> getAllOwners(Pageable pageable);

    List<VehicleOwnerResponse> getAllActiveOwners();

    Page<VehicleOwnerResponse> searchOwners(String search, Boolean isActive, Pageable pageable);

    List<VehicleOwnerResponse> getOwnersByContact(String primaryContact);

    VehicleOwnerResponse updateOwner(Integer id, VehicleOwnerUpdateRequest request);

    void deleteOwner(Integer id);

    VehicleOwnerResponse toggleOwnerStatus(Integer id);
}