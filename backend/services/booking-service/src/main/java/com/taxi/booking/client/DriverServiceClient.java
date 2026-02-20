package com.taxi.booking.client;

import com.taxi.booking.dto.response.ApiResponse;
import com.taxi.booking.dto.response.DriverResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Feign client for communicating with Driver Service
 */
@FeignClient(name = "driver-service")
public interface DriverServiceClient {
    @GetMapping("/api/drivers/{id}")
    DriverResponse getDriverById(@PathVariable("id") Integer id);

    @GetMapping("/api/drivers")
    List<DriverResponse> getAllDrivers(
            @RequestParam(name = "activeOnly", required = false, defaultValue = "true") Boolean activeOnly);
}