package com.taxi.driver.client;

import com.taxi.driver.dto.response.CompanyResponse;
import com.taxi.driver.dto.response.VehicleResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for communicating with Vehicle Service
 * Used to fetch vehicle and company details
 */
@FeignClient(name = "vehicle-service", fallback = VehicleServiceClientFallback.class)
public interface VehicleServiceClient {

    /**
     * Get vehicle by ID
     */
    @GetMapping("/api/vehicles/{id}")
    VehicleResponse getVehicleById(@PathVariable("id") Integer id);

    /**
     * Get all vehicles (for dropdown)
     */
    @GetMapping("/api/vehicles")
    List<VehicleResponse> getAllVehicles();

    /**
     * Get company by ID
     */
    @GetMapping("/api/companies/{id}")
    CompanyResponse getCompanyById(@PathVariable("id") Integer id);

    /**
     * Get all companies (for dropdown)
     */
    @GetMapping("/api/companies")
    List<CompanyResponse> getAllCompanies();
}