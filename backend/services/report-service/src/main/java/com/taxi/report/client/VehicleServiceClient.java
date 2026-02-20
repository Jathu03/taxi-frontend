package com.taxi.report.client;

import com.taxi.report.dto.response.VehicleClassResponse;
import com.taxi.report.dto.response.VehicleMakeResponse;
import com.taxi.report.dto.response.VehicleModelResponse;
import com.taxi.report.dto.response.VehicleResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "vehicle-service", url = "${service.urls.vehicle-service}")
public interface VehicleServiceClient {

    @GetMapping("/api/vehicles")
    List<VehicleResponse> getVehicles();

    @GetMapping("/api/vehicle-models")
    List<VehicleModelResponse> getVehicleModels();

    @GetMapping("/api/vehicle-classes")
    List<VehicleClassResponse> getVehicleClasses();

    @GetMapping("/api/vehicle-makes")
    List<VehicleMakeResponse> getVehicleMakes();
}