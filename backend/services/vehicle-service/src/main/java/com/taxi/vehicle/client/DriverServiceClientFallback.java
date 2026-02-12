package com.taxi.vehicle.client;

import com.taxi.vehicle.dto.response.DriverResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Fallback implementation for Driver Service Client
 * Returns default values when Driver Service is unavailable
 */
@Component
@Slf4j
public class DriverServiceClientFallback implements DriverServiceClient {

    @Override
    public DriverResponse getDriverById(Integer id) {
        log.warn("Driver Service unavailable, returning fallback for driver id: {}", id);
        return DriverResponse.builder()
                .id(id)
                .firstName("Unknown")
                .lastName("Driver")
                .build();
    }
}