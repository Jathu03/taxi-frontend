package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleCreateRequest;
import com.taxi.vehicle.dto.request.VehicleUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    VehicleResponse createVehicle(VehicleCreateRequest request);

    VehicleResponse getVehicleById(Integer id);

    Page<VehicleResponse> searchVehicles(String search, Boolean isActive, Pageable pageable);

    VehicleResponse updateVehicle(Integer id, VehicleUpdateRequest request);

    void deleteVehicle(Integer id);
}