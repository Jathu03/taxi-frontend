package com.taxi.report.client;

import com.taxi.report.dto.response.DriverResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "driver-service", url = "${service.urls.driver-service}")
public interface DriverServiceClient {

    @GetMapping("/api/drivers")
    List<DriverResponse> getDrivers(@RequestParam(required = false, defaultValue = "false") Boolean activeOnly);
}