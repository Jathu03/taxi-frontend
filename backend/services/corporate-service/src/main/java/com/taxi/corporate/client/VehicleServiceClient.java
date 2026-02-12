package com.taxi.corporate.client;

import com.taxi.corporate.dto.response.VehicleClassResponse;
import com.taxi.corporate.dto.response.VehicleCategoryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "vehicle-service")
public interface VehicleServiceClient {

    @GetMapping("/api/vehicle-classes")
    List<VehicleClassResponse> getAllVehicleClasses();

    @GetMapping("/api/vehicle-classes/{id}")
    VehicleClassResponse getVehicleClassById(@PathVariable("id") Integer id);

    @GetMapping("/api/vehicle-categories")
    List<VehicleCategoryResponse> getAllVehicleCategories();

    @GetMapping("/api/vehicle-categories/{id}")
    VehicleCategoryResponse getVehicleCategoryById(@PathVariable("id") Integer id);
}