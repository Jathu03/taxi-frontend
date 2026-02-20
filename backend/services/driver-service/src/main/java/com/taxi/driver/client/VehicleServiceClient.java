package com.taxi.driver.client;

import com.taxi.driver.dto.external.ExternalApiResponse;
import com.taxi.driver.dto.external.VehicleResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "vehicle-service", path = "/api/vehicles")
public interface VehicleServiceClient {

    @GetMapping
    ExternalApiResponse<List<VehicleResponse>> searchVehicles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive);
}
