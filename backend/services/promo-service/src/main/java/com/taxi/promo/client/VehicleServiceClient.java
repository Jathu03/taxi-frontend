package com.taxi.promo.client;

import com.taxi.promo.dto.response.VehicleClassResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with Vehicle Service
 * Used to fetch vehicle class details
 * NO FALLBACK - Will throw exception if Vehicle Service is unavailable
 */
@FeignClient(name = "vehicle-service", url = "${service.urls.vehicle-service}")
public interface VehicleServiceClient {

    /**
     * Get vehicle class by ID
     */
    @GetMapping("/api/vehicle-classes/{id}")
    VehicleClassResponse getVehicleClassById(@PathVariable("id") Integer id);

    /**
     * Get all vehicle classes (for dropdown)
     */
    @GetMapping("/api/vehicle-classes")
    List<VehicleClassResponse> getAllVehicleClasses();
}