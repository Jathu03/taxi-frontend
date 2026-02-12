package com.taxi.driver.client;

import com.taxi.driver.dto.response.CompanyResponse;
import com.taxi.driver.dto.response.VehicleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Fallback implementation for Vehicle Service Client
 * Returns default values when Vehicle Service is unavailable
 */
@Component
@Slf4j
public class VehicleServiceClientFallback implements VehicleServiceClient {

    @Override
    public VehicleResponse getVehicleById(Integer id) {
        log.warn("Vehicle Service unavailable, returning fallback for vehicle id: {}", id);
        return VehicleResponse.builder()
                .id(id)
                .vehicleCode("Unknown")
                .build();
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {
        log.warn("Vehicle Service unavailable, returning empty list for vehicles");
        return new ArrayList<>();
    }

    @Override
    public CompanyResponse getCompanyById(Integer id) {
        log.warn("Vehicle Service unavailable, returning fallback for company id: {}", id);
        return CompanyResponse.builder()
                .id(id)
                .companyName("Unknown")
                .build();
    }

    @Override
    public List<CompanyResponse> getAllCompanies() {
        log.warn("Vehicle Service unavailable, returning empty list for companies");
        return new ArrayList<>();
    }
}