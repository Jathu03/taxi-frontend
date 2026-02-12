package com.taxi.vehicle.client;

import com.taxi.vehicle.dto.response.DriverResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for communicating with Driver Service
 * Used to fetch driver details for device assignments
 */
@FeignClient(name = "DRIVER-SERVICE", fallback = DriverServiceClientFallback.class)
public interface DriverServiceClient {

    /**
     * Get driver by ID
     */
    @GetMapping("/api/drivers/{id}")
    DriverResponse getDriverById(@PathVariable("id") Integer id);
}