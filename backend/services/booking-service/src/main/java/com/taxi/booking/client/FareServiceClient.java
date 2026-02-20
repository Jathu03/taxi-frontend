package com.taxi.booking.client;

import com.taxi.booking.dto.response.ApiResponse;
import com.taxi.booking.dto.response.FareSchemeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with Fare Service
 */
@FeignClient(name = "fare-promo-service", contextId = "fareServiceClient")
public interface FareServiceClient {
    @GetMapping("/api/fare-schemes/{id}")
    FareSchemeResponse getFareSchemeById(@PathVariable("id") Integer id);

    @GetMapping("/api/fare-schemes")
    List<FareSchemeResponse> getAllFareSchemes();
}