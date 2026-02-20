package com.taxi.vehicle.client;

import com.taxi.vehicle.dto.response.FareSchemeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for communicating with Fare Service
 * Used to fetch fare scheme details for vehicle classes
 */
@FeignClient(name = "FARE-SERVICE", fallback = FareServiceClientFallback.class)
public interface FareServiceClient {

    /**
     * Get fare scheme by ID
     */
    @GetMapping("/api/fare-schemes/{id}")
    FareSchemeResponse getFareSchemeById(@PathVariable("id") Integer id);
}