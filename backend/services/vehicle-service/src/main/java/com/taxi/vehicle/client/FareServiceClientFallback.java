package com.taxi.vehicle.client;

import com.taxi.vehicle.dto.response.FareSchemeResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Fallback implementation for Fare Service Client
 * Returns default values when Fare Service is unavailable
 */
@Component
@Slf4j
public class FareServiceClientFallback implements FareServiceClient {

    @Override
    public FareSchemeResponse getFareSchemeById(Integer id) {
        log.warn("Fare Service unavailable, returning fallback for fare scheme id: {}", id);
        return FareSchemeResponse.builder()
                .id(id)
                .fareName("Unavailable")
                .build();
    }
}