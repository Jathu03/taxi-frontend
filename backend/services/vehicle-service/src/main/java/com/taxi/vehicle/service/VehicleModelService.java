package com.taxi.vehicle.service;

import com.taxi.vehicle.dto.request.VehicleModelCreateRequest;
import com.taxi.vehicle.dto.request.VehicleModelUpdateRequest;
import com.taxi.vehicle.dto.response.VehicleModelResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VehicleModelService {

    VehicleModelResponse createModel(VehicleModelCreateRequest request);

    VehicleModelResponse getModelById(Integer id);

    Page<VehicleModelResponse> getAllModels(Pageable pageable);

    Page<VehicleModelResponse> searchModels(String search, Pageable pageable);

    List<VehicleModelResponse> getModelsByMakeId(Integer makeId);

    Page<VehicleModelResponse> searchModelsByMake(Integer makeId, String search, Pageable pageable);

    VehicleModelResponse updateModel(Integer id, VehicleModelUpdateRequest request);

    void deleteModel(Integer id);
}