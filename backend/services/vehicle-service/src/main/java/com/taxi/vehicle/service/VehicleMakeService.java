package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleMakeCreateRequest;
import com.taxi.vehicle.dto.request.VehicleMakeUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleMakeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VehicleMakeService {

    VehicleMakeResponse createMake(VehicleMakeCreateRequest request);

    VehicleMakeResponse getMakeById(Integer id);

    Page<VehicleMakeResponse> getAllMakes(Pageable pageable);

    Page<VehicleMakeResponse> searchMakes(String search, Pageable pageable);

    List<VehicleMakeResponse> getAllMakesList();

    VehicleMakeResponse updateMake(Integer id, VehicleMakeUpdateRequest request);

    void deleteMake(Integer id);
}