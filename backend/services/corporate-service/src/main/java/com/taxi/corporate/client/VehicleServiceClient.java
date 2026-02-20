package com.taxi.corporate.client;

import com.taxi.corporate.dto.response.ApiResponse;
import com.taxi.corporate.dto.response.VehicleClassResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "vehicle-service")
public interface VehicleServiceClient {

    // ✅ Return ApiResponse wrapper, NOT raw List
    @GetMapping("/api/vehicle-classes")
    ApiResponse<List<VehicleClassResponse>> getAllVehicleClasses();

    @GetMapping("/api/vehicle-classes/{id}")
    ApiResponse<VehicleClassResponse> getVehicleClassById(@PathVariable("id") Integer id);
}