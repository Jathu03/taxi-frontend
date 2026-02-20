package com.taxi.booking.client;

import com.taxi.booking.dto.response.ApiResponse;
import com.taxi.booking.dto.response.VehicleClassResponse;
import com.taxi.booking.dto.response.VehicleResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with Vehicle Service
 */
@FeignClient(name = "vehicle-service")
public interface VehicleServiceClient {
    @GetMapping("/api/vehicle-classes/{id}")
    VehicleClassResponse getVehicleClassById(@PathVariable("id") Integer id);

    @GetMapping("/api/vehicle-classes")
    List<VehicleClassResponse> getAllVehicleClasses();

    @GetMapping("/api/vehicles/{id}")
    VehicleResponse getVehicleById(@PathVariable("id") Integer id);

    @GetMapping("/api/vehicles")
    List<VehicleResponse> getAllVehicles();
}